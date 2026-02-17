"""
Task and deadline management models
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Enum
from sqlalchemy.sql import func
from ..database import Base
import enum


class TaskStatus(str, enum.Enum):
    """Task status enumeration"""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TaskPriority(str, enum.Enum):
    """Task priority levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Task(Base):
    """Task with deadline and priority tracking"""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    
    # Scheduling
    deadline = Column(DateTime)
    estimated_hours = Column(Float, default=1.0)
    scheduled_start = Column(DateTime)
    scheduled_end = Column(DateTime)
    
    # Priority & Status (using String for SQLite compatibility)
    priority = Column(String(20), default="medium")
    status = Column(String(20), default="todo")
    priority_score = Column(Float, default=0.0)  # AI-calculated priority
    
    # Metadata
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    completed_at = Column(DateTime)
    
    # Tags and categorization
    tags = Column(String(500))  # Comma-separated tags
    category = Column(String(100))


class DeepWorkBlock(Base):
    """Scheduled deep work time blocks"""
    __tablename__ = "deep_work_blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    
    # Associated task (optional)
    task_id = Column(Integer)
    
    # Block metadata
    focus_area = Column(String(200))
    energy_level = Column(String(50))  # high, medium, low
    
    created_at = Column(DateTime, server_default=func.now())
