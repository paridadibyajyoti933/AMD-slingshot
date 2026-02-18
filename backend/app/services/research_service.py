"""
Research Service
Handles business logic for research paper processing
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import logging

from ..models.research import ResearchPaper, Citation, Embedding
from ..services.pdf import section_extractor
from ..services.ai import llm_service, embedding_service, citation_service
from ..services.vector import faiss_store

logger = logging.getLogger(__name__)

async def process_paper_logic(paper_id: int, db: AsyncSession):
    """
    Process paper: extract sections, generate embeddings, create citations
    """
    try:
        # Get paper
        result = await db.execute(select(ResearchPaper).where(ResearchPaper.id == paper_id))
        paper = result.scalar_one_or_none()
        
        if not paper:
            logger.error(f"Paper {paper_id} not found for processing")
            return
        
        logger.info(f"Starting processing for paper {paper_id}")
        
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
        logger.info(f"Completed processing for paper {paper_id}")
        
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
        
    except Exception as e:
        logger.error(f"Error processing paper {paper_id}: {str(e)}")
        # Optionally set some error state on the paper
        return None
