# AI Document Extractor - Backend

FastAPI-based backend for the AI Document Extractor application.

## Features

- RESTful API with FastAPI
- JWT authentication
- PostgreSQL database with SQLAlchemy
- Google Gemini AI integration
- Document processing (images and PDFs)
- AI-powered chat functionality

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/ai_doc_extractor
SECRET_KEY=your-secret-key
GOOGLE_API_KEY=your-gemini-api-key
DEBUG=True
UPLOAD_DIR=./uploads
```

## Running

```bash
python main.py
```

Server runs on http://localhost:8000

## API Documentation

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

## Database

### Initialize Database
The database tables are created automatically on first run.

### Manual Migration (if needed)
```bash
# Using psql
psql -U postgres
CREATE DATABASE ai_doc_extractor;
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Documents
- POST `/api/documents/upload` - Upload document
- GET `/api/documents` - List documents
- GET `/api/documents/{id}` - Get document
- GET `/api/documents/{id}/extracted-data` - Get extracted data
- DELETE `/api/documents/{id}` - Delete document

### Chat
- POST `/api/chat/message` - Send message
- GET `/api/chat/history/{document_id}` - Get chat history

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Google Gemini AI
- LangChain & LangGraph
- JWT (python-jose)
- Bcrypt (passlib)
