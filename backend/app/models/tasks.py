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
    deadline = Column(DateTime(timezone=True))
    estimated_hours = Column(Float, default=1.0)
    scheduled_start = Column(DateTime(timezone=True))
    scheduled_end = Column(DateTime(timezone=True))
    
    # Priority & Status
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO)
    priority_score = Column(Float, default=0.0)  # AI-calculated priority
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Tags and categorization
    tags = Column(String(500))  # Comma-separated tags
    category = Column(String(100))


class DeepWorkBlock(Base):
    """Scheduled deep work time blocks"""
    __tablename__ = "deep_work_blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    
    # Associated task (optional)
    task_id = Column(Integer)
    
    # Block metadata
    focus_area = Column(String(200))
    energy_level = Column(String(50))  # high, medium, low
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
