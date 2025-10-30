from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from database import init_db
from config import settings
from routers import auth_router, document_router, chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    init_db()
    print("Database initialized successfully")
    print(f"Server running on http://localhost:8000")
    print(f"API docs available at http://localhost:8000/docs")
    yield
    # Shutdown (if needed)
    print("Application shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title="AI Document Extractor API",
    description="AI-powered document extraction and Q&A system",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Mount static files for serving uploaded documents
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth_router.router)
app.include_router(document_router.router)
app.include_router(chat_router.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Document Extractor API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
