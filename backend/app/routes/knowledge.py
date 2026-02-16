"""
Knowledge Hub API Routes
Semantic search across all content
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional

from ..database import get_db
from ..models.knowledge import KnowledgeChunk, SourceType
from ..models.research import ResearchPaper
from ..models.meetings import Meeting, Note
from ..services.ai import embedding_service
from ..services.vector import faiss_store

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


class SearchQuery(BaseModel):
    query: str
    top_k: int = 5
    source_types: Optional[List[SourceType]] = None


@router.post("/search")
async def semantic_search(
    search_data: SearchQuery,
    db: AsyncSession = Depends(get_db)
):
    """
    Perform semantic search across all knowledge
    
    Returns:
        Relevant chunks with source information
    """
    # Generate query embedding
    query_vector = embedding_service.encode_single(search_data.query)
    
    # Search FAISS
    results = faiss_store.search(query_vector, k=search_data.top_k)
    
    if not results:
        return {
            "query": search_data.query,
            "results": [],
            "total": 0
        }
    
    # Get chunk details from database
    chunk_ids = [r[0] for r in results]
    distances = {r[0]: r[1] for r in results}
    
    # Fetch chunks
    chunk_result = await db.execute(
        select(KnowledgeChunk).where(KnowledgeChunk.embedding_id.in_(chunk_ids))
    )
    chunks = chunk_result.scalars().all()
    
    # Build response with source details
    search_results = []
    for chunk in chunks:
        # Get source details
        source_info = await _get_source_info(chunk.source_type, chunk.source_id, db)
        
        search_results.append({
            "chunk_id": chunk.id,
            "content": chunk.content,
            "source_type": chunk.source_type,
            "source_id": chunk.source_id,
            "source_info": source_info,
            "similarity_score": 1.0 - distances.get(chunk.embedding_id, 1.0),  # Convert distance to similarity
            "created_at": chunk.created_at
        })
    
    # Sort by similarity
    search_results.sort(key=lambda x: x["similarity_score"], reverse=True)
    
    return {
        "query": search_data.query,
        "results": search_results,
        "total": len(search_results)
    }


@router.get("/stats")
async def get_knowledge_stats(
    db: AsyncSession = Depends(get_db)
):
    """Get knowledge base statistics"""
    # Count papers
    papers_result = await db.execute(select(ResearchPaper))
    papers_count = len(papers_result.scalars().all())
    
    # Count meetings
    meetings_result = await db.execute(select(Meeting))
    meetings_count = len(meetings_result.scalars().all())
    
    # Count notes
    notes_result = await db.execute(select(Note))
    notes_count = len(notes_result.scalars().all())
    
    # Count chunks
    chunks_result = await db.execute(select(KnowledgeChunk))
    chunks_count = len(chunks_result.scalars().all())
    
    # FAISS stats
    faiss_stats = faiss_store.get_stats()
    
    return {
        "research_papers": papers_count,
        "meetings": meetings_count,
        "notes": notes_count,
        "knowledge_chunks": chunks_count,
        "vector_store": faiss_stats
    }


@router.post("/index-all")
async def index_all_content(
    db: AsyncSession = Depends(get_db)
):
    """
    Re-index all content for semantic search
    Useful for initial setup or rebuilding index
    """
    indexed_count = 0
    
    # Index research papers
    papers_result = await db.execute(select(ResearchPaper).where(ResearchPaper.processed == 2))
    papers = papers_result.scalars().all()
    
    for paper in papers:
        if paper.full_text:
            chunks, vectors = embedding_service.embed_document(paper.full_text)
            db_ids = [paper.id] * len(chunks)
            faiss_indices = faiss_store.add_vectors(vectors, db_ids)
            
            # Save chunks
            for i, (chunk, faiss_idx) in enumerate(zip(chunks, faiss_indices)):
                knowledge_chunk = KnowledgeChunk(
                    source_type=SourceType.RESEARCH_PAPER,
                    source_id=paper.id,
                    content=chunk,
                    chunk_index=i,
                    embedding_id=faiss_idx
                )
                db.add(knowledge_chunk)
            
            indexed_count += len(chunks)
    
    # Index meetings
    meetings_result = await db.execute(select(Meeting).where(Meeting.processed == 2))
    meetings = meetings_result.scalars().all()
    
    for meeting in meetings:
        if meeting.summary:
            # Index summary
            vector = embedding_service.encode_single(meeting.summary)
            faiss_idx = faiss_store.add_vectors(vector.reshape(1, -1), [meeting.id])[0]
            
            chunk = KnowledgeChunk(
                source_type=SourceType.MEETING,
                source_id=meeting.id,
                content=meeting.summary,
                chunk_index=0,
                embedding_id=faiss_idx
            )
            db.add(chunk)
            indexed_count += 1
    
    # Index notes
    notes_result = await db.execute(select(Note))
    notes = notes_result.scalars().all()
    
    for note in notes:
        if note.content:
            vector = embedding_service.encode_single(note.content)
            faiss_idx = faiss_store.add_vectors(vector.reshape(1, -1), [note.id])[0]
            
            chunk = KnowledgeChunk(
                source_type=SourceType.NOTE,
                source_id=note.id,
                content=note.content,
                chunk_index=0,
                embedding_id=faiss_idx
            )
            db.add(chunk)
            indexed_count += 1
    
    await db.commit()
    faiss_store.save_index()
    
    return {
        "status": "complete",
        "indexed_chunks": indexed_count,
        "papers": len(papers),
        "meetings": len(meetings),
        "notes": len(notes)
    }


async def _get_source_info(source_type: SourceType, source_id: int, db: AsyncSession) -> dict:
    """Get source document information"""
    if source_type == SourceType.RESEARCH_PAPER:
        result = await db.execute(select(ResearchPaper).where(ResearchPaper.id == source_id))
        paper = result.scalar_one_or_none()
        if paper:
            return {
                "title": paper.title,
                "authors": paper.authors,
                "uploaded_at": paper.uploaded_at
            }
    
    elif source_type == SourceType.MEETING:
        result = await db.execute(select(Meeting).where(Meeting.id == source_id))
        meeting = result.scalar_one_or_none()
        if meeting:
            return {
                "title": meeting.title,
                "meeting_date": meeting.meeting_date,
                "participants": meeting.participants
            }
    
    elif source_type == SourceType.NOTE:
        result = await db.execute(select(Note).where(Note.id == source_id))
        note = result.scalar_one_or_none()
        if note:
            return {
                "title": note.title,
                "created_at": note.created_at,
                "tags": note.tags
            }
    
    return {}
