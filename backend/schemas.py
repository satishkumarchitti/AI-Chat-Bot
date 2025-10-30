from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Document Schemas
class DocumentBase(BaseModel):
    filename: str
    file_type: str


class DocumentCreate(DocumentBase):
    file_path: str
    file_size: int
    user_id: int


class Document(DocumentBase):
    id: int
    user_id: int
    file_path: str
    file_size: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class DocumentWithData(Document):
    extracted_data: Optional[Dict[str, Any]] = None


# Extracted Data Schemas
class ExtractedDataBase(BaseModel):
    data: Dict[str, Any]
    coordinates: Optional[Dict[str, Any]] = None
    confidence_scores: Optional[Dict[str, Any]] = None


class ExtractedDataCreate(ExtractedDataBase):
    document_id: int


class ExtractedData(ExtractedDataBase):
    id: int
    document_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Chat Schemas
class ChatMessageBase(BaseModel):
    message: str


class ChatMessageCreate(ChatMessageBase):
    document_id: int


class ChatMessage(BaseModel):
    id: int
    user_id: int
    document_id: int
    message: str
    response: str
    sender: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    response: str
    message_id: int


# Response Schemas
class AuthResponse(BaseModel):
    token: str
    user: User
