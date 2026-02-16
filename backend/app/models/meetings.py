"""
Meeting and transcript models
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from ..database import Base


class Meeting(Base):
    """Meeting transcripts and summaries"""
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    
    # Content
    transcript = Column(Text)
    audio_path = Column(String(500))
    
    # AI-generated content
    summary = Column(Text)
    key_points = Column(JSON, default=[])  # List of key points
    decisions = Column(JSON, default=[])  # List of decisions made
    action_items = Column(JSON, default=[])  # List of action items
    
    # Metadata
    meeting_date = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer)
    participants = Column(JSON, default=[])  # List of participant names
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    processed = Column(Integer, default=0)  # 0=pending, 1=processing, 2=complete


class Note(Base):
    """User notes and knowledge entries"""
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=False)
    
    # Categorization
    tags = Column(JSON, default=[])
    category = Column(String(100))
    
    # Linking
    related_paper_id = Column(Integer)
    related_meeting_id = Column(Integer)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
