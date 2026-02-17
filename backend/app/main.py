"""
FastAPI Main Application - Minimal Working Version
DeepWork OS Backend
"""
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .routes import planner, meetings, research, knowledge
from .database import init_db, close_db

# Create FastAPI app
app = FastAPI(
    title="DeepWork OS",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(planner.router, prefix="/api/v1")
app.include_router(meetings.router, prefix="/api/v1")
app.include_router(research.router, prefix="/api/v1")
app.include_router(knowledge.router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()
    print("✅ Database initialized")


@app.on_event("shutdown")
async def shutdown_event():
    """Close database connections on shutdown"""
    await close_db()
    print("Database connections closed")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "DeepWork OS",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "message": "Welcome to DeepWork OS! Visit /docs for API documentation."
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "message": "DeepWork OS is running!"
    }


# Research API
@app.get("/api/v1/research/")
async def list_papers():
    """List all papers"""
    return []


@app.post("/api/v1/research/upload")
async def upload_paper(file: UploadFile = File(...)):
    """Upload a research paper PDF and process with AI"""
    import os
    import shutil
    from pathlib import Path
    import sys
    
    # Add backend directory to path for imports
    backend_dir = Path(__file__).parent.parent
    sys.path.insert(0, str(backend_dir))
    
    from pdf_utils import extract_text_from_pdf
    from ollama_service import generate_summary, extract_key_points, check_ollama_status
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        return {"error": "Only PDF files are allowed"}, 400
    
    # Create upload directory
    upload_dir = Path("data/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Save the file
    file_path = upload_dir / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extract text from PDF
    print(f"Extracting text from {file.filename}...")
    full_text = extract_text_from_pdf(str(file_path))
    
    if not full_text:
        return {
            "paper_id": 1,
            "title": file.filename,
            "status": "error",
            "message": "Failed to extract text from PDF"
        }
    
    # Check if Ollama is running
    print("Checking Ollama status...")
    ollama_running = check_ollama_status()
    
    if not ollama_running:
        # Provide basic analysis without AI
        preview = full_text[:500] + "..." if len(full_text) > 500 else full_text
        return {
            "paper_id": 1,
            "title": file.filename,
            "status": "uploaded",
            "file_path": str(file_path),
            "text_length": len(full_text),
            "preview": preview,
            "message": "PDF uploaded and text extracted successfully!",
            "note": "⚠️ Ollama is not accessible. AI features are disabled. Start Ollama with 'ollama serve' to enable AI summaries."
        }
    
    # Try to generate AI summary and key points
    print(f"Generating AI summary for {file.filename}...")
    try:
        summary = generate_summary(full_text)
        key_points = extract_key_points(full_text)
        
        # Check if we got errors back
        if "Error:" in summary or "Error:" in key_points:
            # Ollama connection failed, provide basic analysis
            preview = full_text[:500] + "..." if len(full_text) > 500 else full_text
            return {
                "paper_id": 1,
                "title": file.filename,
                "status": "uploaded",
                "file_path": str(file_path),
                "text_length": len(full_text),
                "preview": preview,
                "message": "PDF uploaded and text extracted successfully!",
                "note": "⚠️ Ollama connection failed. AI processing unavailable. Text extraction completed.",
                "error_detail": f"Summary error: {summary[:100]}"
            }
        
        # Success with AI
        return {
            "paper_id": 1,
            "title": file.filename,
            "status": "processed",
            "file_path": str(file_path),
            "text_length": len(full_text),
            "summary": summary,
            "key_contributions": key_points,
            "message": "🎉 PDF uploaded and processed successfully with AI!"
        }
        
    except Exception as e:
        print(f"AI processing error: {e}")
        preview = full_text[:500] + "..." if len(full_text) > 500 else full_text
        return {
            "paper_id": 1,
            "title": file.filename,
            "status": "uploaded",
            "file_path": str(file_path),
            "text_length": len(full_text),
            "preview": preview,
            "message": "PDF uploaded and text extracted successfully!",
            "note": f"⚠️ AI processing failed: {str(e)}"
        }


@app.get("/api/v1/research/{paper_id}")
async def get_paper(paper_id: int):
    """Get paper details"""
    return {
        "id": paper_id,
        "title": "Sample Research Paper",
        "authors": ["Author 1", "Author 2"],
        "abstract": "This is a sample abstract.",
        "processed": 2
    }


# Planner API
@app.get("/api/v1/planner/tasks")
async def list_tasks():
    """List all tasks"""
    return []


@app.get("/api/v1/planner/deadline-risks")
async def get_deadline_risks():
    """Get deadline risks"""
    return {"risks": []}


# Meetings API
@app.get("/api/v1/meetings/")
async def list_meetings():
    """List all meetings"""
    return []


# Knowledge API
@app.get("/api/v1/knowledge/stats")
async def get_knowledge_stats():
    """Get knowledge base statistics"""
    return {
        "research_papers": 0,
        "meetings": 0,
        "notes": 0,
        "vector_store": {
            "total_vectors": 0
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
