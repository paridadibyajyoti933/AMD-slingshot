"""
Research paper database model
Stores uploaded PDFs, extracted content, and metadata
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class ResearchPaper(Base):
    """Research paper with extracted content"""
    __tablename__ = "research_papers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    authors = Column(JSON, default=[])  # List of author names
    abstract = Column(Text)
    full_text = Column(Text)
    pdf_path = Column(String(500))
    
    # Extracted sections
    key_contributions = Column(Text)
    methodology = Column(Text)
    limitations = Column(Text)
    equations = Column(JSON, default=[])  # List of important equations
    
    # Metadata
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    processed = Column(Integer, default=0)  # 0=pending, 1=processing, 2=complete
    
    # Relationships
    citations = relationship("Citation", back_populates="paper", cascade="all, delete-orphan")
    embeddings = relationship("Embedding", back_populates="paper", cascade="all, delete-orphan")


class Citation(Base):
    """Generated citations for research papers"""
    __tablename__ = "citations"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("research_papers.id", ondelete="CASCADE"))
    
    apa_format = Column(Text)
    ieee_format = Column(Text)
    bibtex_format = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    paper = relationship("ResearchPaper", back_populates="citations")


class Embedding(Base):
    """Vector embeddings for semantic search"""
    __tablename__ = "embeddings"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("research_papers.id", ondelete="CASCADE"))
    
    chunk_text = Column(Text, nullable=False)
    chunk_index = Column(Integer)
    vector_id = Column(Integer)  # Index in FAISS store
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    paper = relationship("ResearchPaper", back_populates="embeddings")
