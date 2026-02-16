"""
Research Copilot API Routes
Handles PDF upload, extraction, and citation generation
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pathlib import Path
import shutil
from datetime import datetime

from ..database import get_db
from ..models.research import ResearchPaper, Citation, Embedding
from ..services.pdf import pdf_parser, section_extractor
from ..services.ai import llm_service, embedding_service, citation_service
from ..services.vector import faiss_store
from ..config import settings

router = APIRouter(prefix="/research", tags=["research"])


@router.post("/upload")
async def upload_paper(
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
    # Get paper
    result = await db.execute(select(ResearchPaper).where(ResearchPaper.id == paper_id))
    paper = result.scalar_one_or_none()
    
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Extract sections using LLM
    abstract = await llm_service.extract_abstract(paper.full_text)
    key_contributions = await llm_service.extract_key_contributions(paper.full_text)
    methodology = await llm_service.extract_methodology(paper.full_text)
    limitations = await llm_service.extract_limitations(paper.full_text)
    
    # Extract equations
    sections = section_extractor.extract_all_sections(paper.full_text)
    equations = sections.get("equations", [])
    
    # Update paper
    paper.abstract = abstract
    paper.key_contributions = key_contributions
    paper.methodology = methodology
    paper.limitations = limitations
    paper.equations = equations
    
    # Generate citations
    apa = citation_service.generate_apa(
        authors=paper.authors,
        year=datetime.now().year,
        title=paper.title
    )
    
    ieee = citation_service.generate_ieee(
        authors=paper.authors,
        title=paper.title,
        year=datetime.now().year
    )
    
    bibtex = citation_service.generate_bibtex(
        cite_key=f"paper{paper.id}",
        authors=paper.authors,
        title=paper.title,
        year=datetime.now().year
    )
    
    citation = Citation(
        paper_id=paper.id,
        apa_format=apa,
        ieee_format=ieee,
        bibtex_format=bibtex
    )
    db.add(citation)
    
    # Generate embeddings
    chunks, vectors = embedding_service.embed_document(paper.full_text)
    
    # Store in FAISS
    db_ids = [paper.id] * len(chunks)
    faiss_indices = faiss_store.add_vectors(vectors, db_ids)
    
    # Save embeddings to database
    for i, (chunk, faiss_idx) in enumerate(zip(chunks, faiss_indices)):
        embedding = Embedding(
            paper_id=paper.id,
            chunk_text=chunk,
            chunk_index=i,
            vector_id=faiss_idx
        )
        db.add(embedding)
    
    paper.processed = 2  # Complete
    await db.commit()
    
    return {
        "paper_id": paper.id,
        "status": "complete",
        "abstract": abstract,
        "key_contributions": key_contributions,
        "methodology": methodology,
        "limitations": limitations,
        "equations": equations,
        "citations": {
            "apa": apa,
            "ieee": ieee,
            "bibtex": bibtex
        },
        "embeddings_count": len(chunks)
    }


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
            "processed": p.processed
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
    
    review = await llm_service.generate_literature_review(
        title=paper.title,
        abstract=paper.abstract or "",
        key_contributions=paper.key_contributions or ""
    )
    
    return {
        "paper_id": paper.id,
        "literature_review": review
    }
