from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, Document, ChatMessage, ExtractedData
from schemas import ChatMessageCreate, ChatMessage as ChatMessageSchema, ChatResponse
from auth import get_current_user
from ai_service import chatbot

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message and get AI response"""
    # Verify document belongs to user
    document = db.query(Document).filter(
        Document.id == chat_data.document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Get extracted data for context
    extracted_data = db.query(ExtractedData).filter(
        ExtractedData.document_id == chat_data.document_id
    ).first()
    
    if not extracted_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No extracted data available for this document"
        )
    
    # Get chat history for context
    chat_history = db.query(ChatMessage).filter(
        ChatMessage.document_id == chat_data.document_id,
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.desc()).limit(10).all()
    
    # Prepare history for AI
    history_list = [
        {"message": msg.message, "response": msg.response}
        for msg in reversed(chat_history)
    ]
    
    # Get AI response
    try:
        ai_response = chatbot.answer_question(
            question=chat_data.message,
            extracted_data=extracted_data.data,
            chat_history=history_list
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}"
        )
    
    # Save user message
    user_message = ChatMessage(
        user_id=current_user.id,
        document_id=chat_data.document_id,
        message=chat_data.message,
        response="",
        sender="user"
    )
    db.add(user_message)
    
    # Save AI response
    ai_message = ChatMessage(
        user_id=current_user.id,
        document_id=chat_data.document_id,
        message="",
        response=ai_response,
        sender="ai"
    )
    db.add(ai_message)
    
    db.commit()
    db.refresh(ai_message)
    
    return {
        "response": ai_response,
        "message_id": ai_message.id
    }


@router.get("/history/{document_id}", response_model=List[dict])
async def get_chat_history(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat history for a document"""
    # Verify document belongs to user
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Get chat messages
    messages = db.query(ChatMessage).filter(
        ChatMessage.document_id == document_id,
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    # Format messages for frontend
    formatted_messages = []
    for msg in messages:
        if msg.sender == "user" and msg.message:
            formatted_messages.append({
                "id": msg.id,
                "text": msg.message,
                "sender": "user",
                "timestamp": msg.created_at.isoformat()
            })
        elif msg.sender == "ai" and msg.response:
            formatted_messages.append({
                "id": msg.id,
                "text": msg.response,
                "sender": "ai",
                "timestamp": msg.created_at.isoformat()
            })
    
    return formatted_messages


@router.delete("/history/{document_id}")
async def clear_chat_history(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear chat history for a document"""
    # Verify document belongs to user
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete all chat messages
    db.query(ChatMessage).filter(
        ChatMessage.document_id == document_id,
        ChatMessage.user_id == current_user.id
    ).delete()
    
    db.commit()
    
    return {"message": "Chat history cleared successfully"}
