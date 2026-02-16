"""
Knowledge base models for semantic search
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from ..database import Base
import enum


class SourceType(str, enum.Enum):
    """Source type for knowledge chunks"""
    RESEARCH_PAPER = "research_paper"
    MEETING = "meeting"
    NOTE = "note"
    SUMMARY = "summary"


class KnowledgeChunk(Base):
    """Chunked content for semantic search"""
    __tablename__ = "knowledge_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Source information
    source_type = Column(Enum(SourceType), nullable=False)
    source_id = Column(Integer, nullable=False)  # ID of the source document
    
    # Content
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer)
    
    # Vector store reference
    embedding_id = Column(Integer)  # Index in FAISS
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
