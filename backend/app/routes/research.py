"""
Research Copilot API Routes
Handles PDF upload, extraction, and citation generation
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pathlib import Path
import shutil
from datetime import datetime

from ..database import get_db, AsyncSessionLocal
from ..models.research import ResearchPaper, Citation
from ..services.pdf import pdf_parser
from ..services.research_service import process_paper_logic
from ..config import settings

router = APIRouter(prefix="/research", tags=["research"])

async def run_process_paper_task(paper_id: int):
    """
    Background task to run paper processing logic
    """
    async with AsyncSessionLocal() as db:
        await process_paper_logic(paper_id, db)


@router.post("/reprocess-all")
async def reprocess_all_papers(
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Re-queue processing for all papers that are stuck in processing state (processed=1)
    """
    result = await db.execute(
        select(ResearchPaper).where(ResearchPaper.processed == 1)
    )
    stuck_papers = result.scalars().all()
    
    for paper in stuck_papers:
        background_tasks.add_task(run_process_paper_task, paper.id)
    
    return {
        "message": f"Queued {len(stuck_papers)} papers for reprocessing",
        "paper_ids": [p.id for p in stuck_papers]
    }

@router.post("/upload")
async def upload_paper(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload and process a research paper PDF
    
    Returns:
        Paper ID and processing status
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save PDF
    pdf_dir = Path(settings.PDF_DIR)
    pdf_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    pdf_path = pdf_dir / filename
    
    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extract text
    try:
        full_text = pdf_parser.extract_text(str(pdf_path))
        metadata = pdf_parser.extract_metadata(str(pdf_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract PDF: {str(e)}")
    
    # Extract title and authors
    title = metadata.get("title") or pdf_parser.extract_title_from_text(full_text) or file.filename
    authors = pdf_parser.extract_authors_from_text(full_text)
    
    # Create database entry
    paper = ResearchPaper(
        title=title,
        authors=authors,
        full_text=full_text,
        pdf_path=str(pdf_path),
        processed=1  # Processing
    )
    
    db.add(paper)
    await db.commit()
    await db.refresh(paper)
    
    # Trigger background processing
    background_tasks.add_task(run_process_paper_task, paper.id)
    
    return {
        "paper_id": paper.id,
        "title": title,
        "status": "processing",
        "message": "PDF uploaded successfully. Processing in background."
    }


@router.post("/{paper_id}/process")
async def process_paper(
    paper_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Process paper: extract sections, generate embeddings, create citations
    """
    result = await process_paper_logic(paper_id, db)
    
    if not result:
         raise HTTPException(status_code=404, detail="Paper not found or failed to process")
         
    return result


@router.get("/{paper_id}")
async def get_paper(
    paper_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get paper details"""
    result = await db.execute(
        select(ResearchPaper).where(ResearchPaper.id == paper_id)
    )
    paper = result.scalar_one_or_none()
    
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Get citations
    citation_result = await db.execute(
        select(Citation).where(Citation.paper_id == paper_id)
    )
    citation = citation_result.scalar_one_or_none()
    
    return {
        "id": paper.id,
        "title": paper.title,
        "authors": paper.authors,
        "abstract": paper.abstract,
        "key_contributions": paper.key_contributions,
        "methodology": paper.methodology,
        "limitations": paper.limitations,
        "equations": paper.equations,
        "processed": paper.processed,
        "uploaded_at": paper.uploaded_at,
        "citations": {
            "apa": citation.apa_format if citation else None,
            "ieee": citation.ieee_format if citation else None,
            "bibtex": citation.bibtex_format if citation else None
        } if citation else None
    }


@router.get("/")
async def list_papers(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """List all papers"""
    result = await db.execute(
        select(ResearchPaper)
        .order_by(ResearchPaper.uploaded_at.desc())
        .offset(skip)
        .limit(limit)
    )
    papers = result.scalars().all()
    
    return [
        {
            "id": p.id,
            "title": p.title,
            "authors": p.authors,
            "uploaded_at": p.uploaded_at,
            "processed": p.processed,
            "abstract": p.abstract,
            "key_contributions": p.key_contributions,
            "key_findings": p.key_contributions  # Alias for compatibility if needed
        }
        for p in papers
    ]


@router.post("/{paper_id}/literature-review")
async def generate_literature_review(
    paper_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Generate literature review paragraph for a paper"""
    result = await db.execute(select(ResearchPaper).where(ResearchPaper.id == paper_id))
    paper = result.scalar_one_or_none()
    
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Check if necessary fields exist, if not, try to extract them appropriately or use available text
    abstract = paper.abstract or ""
    key_contributions = paper.key_contributions or ""
    
    # If fields are empty and paper is processed, they might just be empty in the PDF. 
    # If paper is not processed, we might want to trigger processing, but for now let's just use what we have.
    
    from ..services.ai import llm_service # Import here to avoid circular dependencies if any, though top level should be fine
    
    review = await llm_service.generate_literature_review(
        title=paper.title,
        abstract=abstract,
        key_contributions=key_contributions
    )
    
    return {
        "paper_id": paper.id,
        "literature_review": review
    }
