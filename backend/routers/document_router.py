import os
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, BackgroundTasks
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User, Document, ExtractedData
from schemas import Document as DocumentSchema, ExtractedData as ExtractedDataSchema
from auth import get_current_user
from ai_service import document_extractor
from config import settings
import json
import csv
from io import StringIO

router = APIRouter(prefix="/api/documents", tags=["Documents"])

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


def process_document(document_id: int, file_path: str, file_type: str, db: Session):
    """Background task to process document and extract data"""
    try:
        # Update status to processing
        document = db.query(Document).filter(Document.id == document_id).first()
        document.status = "processing"
        db.commit()
        
        # Extract structured data using AI
        extracted_data = document_extractor.extract_structured_data(file_path, file_type)
        
        # Save extracted data
        extracted_data_obj = ExtractedData(
            document_id=document_id,
            data=extracted_data,
            coordinates={},  # TODO: Implement coordinate extraction
            confidence_scores={}
        )
        db.add(extracted_data_obj)
        
        # Update document status
        document.status = "processed"
        db.commit()
        
    except Exception as e:
        print(f"Error processing document {document_id}: {e}")
        document = db.query(Document).filter(Document.id == document_id).first()
        document.status = "failed"
        db.commit()


@router.post("/upload", response_model=DocumentSchema)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a document (image or PDF)"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, and PDF are allowed."
        )
    
    # Determine file type
    file_type = "image" if file.content_type.startswith("image/") else "pdf"
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{current_user.id}_{len(os.listdir(settings.UPLOAD_DIR))}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Create document record
    new_document = Document(
        user_id=current_user.id,
        filename=file.filename,
        file_path=f"/uploads/{unique_filename}",
        file_type=file_type,
        file_size=file_size,
        status="pending"
    )
    
    db.add(new_document)
    db.commit()
    db.refresh(new_document)
    
    # Process document in background
    background_tasks.add_task(process_document, new_document.id, file_path, file_type, db)
    
    return new_document


@router.get("", response_model=List[DocumentSchema])
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all documents for current user"""
    documents = db.query(Document).filter(
        Document.user_id == current_user.id
    ).order_by(Document.created_at.desc()).all()
    
    return documents


@router.get("/{document_id}", response_model=DocumentSchema)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document


@router.get("/{document_id}/extracted-data")
async def get_extracted_data(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get extracted data for a document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    extracted_data = db.query(ExtractedData).filter(
        ExtractedData.document_id == document_id
    ).first()
    
    if not extracted_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Extracted data not available yet"
        )
    
    return extracted_data.data


@router.put("/{document_id}/extracted-data")
async def update_extracted_data(
    document_id: int,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update extracted data"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    extracted_data = db.query(ExtractedData).filter(
        ExtractedData.document_id == document_id
    ).first()
    
    if not extracted_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Extracted data not found"
        )
    
    # Update data
    current_data = extracted_data.data
    current_data.update(data)
    extracted_data.data = current_data
    
    db.commit()
    
    return {"message": "Data updated successfully"}


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete file
    file_path = os.path.join(settings.UPLOAD_DIR, os.path.basename(document.file_path))
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete from database
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}


@router.get("/{document_id}/export/{format}")
async def export_data(
    document_id: int,
    format: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export extracted data as JSON or CSV"""
    if format not in ["json", "csv"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid format. Use 'json' or 'csv'"
        )
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    extracted_data = db.query(ExtractedData).filter(
        ExtractedData.document_id == document_id
    ).first()
    
    if not extracted_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No data to export"
        )
    
    data = extracted_data.data
    
    if format == "json":
        return StreamingResponse(
            iter([json.dumps(data, indent=2)]),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=extracted_data_{document_id}.json"}
        )
    else:  # csv
        output = StringIO()
        if data:
            writer = csv.writer(output)
            writer.writerow(["Field", "Value"])
            for key, value in data.items():
                writer.writerow([key, str(value)])
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=extracted_data_{document_id}.csv"}
        )
