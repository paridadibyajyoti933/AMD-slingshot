"""
Weekly Planner API Routes
Task management and schedule optimization
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List

from ..database import get_db
from ..models.tasks import Task, DeepWorkBlock, TaskStatus, TaskPriority
from ..services.scheduler import schedule_optimizer

router = APIRouter(prefix="/planner", tags=["planner"])


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: Optional[float] = 1.0
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    tags: Optional[str] = None
    category: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    tags: Optional[str] = None
    category: Optional[str] = None


@router.post("/tasks")
async def create_task(
    task_data: TaskCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new task"""
    # Calculate priority score
    task = Task(
        title=task_data.title,
        description=task_data.description,
        deadline=task_data.deadline,
        estimated_hours=task_data.estimated_hours,
        priority=task_data.priority,
        tags=task_data.tags,
        category=task_data.category
    )
    
    # Calculate priority score
    task.priority_score = schedule_optimizer.calculate_priority_score(task, datetime.now())
    
    db.add(task)
    await db.commit()
    await db.refresh(task)
    
    return {
        "id": task.id,
        "title": task.title,
        "deadline": task.deadline,
        "priority": task.priority,
        "priority_score": task.priority_score,
        "status": task.status
    }


@router.get("/tasks")
async def list_tasks(
    status: Optional[TaskStatus] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """List tasks with optional status filter"""
    query = select(Task).order_by(Task.priority_score.desc())
    
    if status:
        query = query.where(Task.status == status)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    tasks = result.scalars().all()
    
    return [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "deadline": t.deadline,
            "estimated_hours": t.estimated_hours,
            "priority": t.priority,
            "priority_score": t.priority_score,
            "status": t.status,
            "tags": t.tags,
            "category": t.category,
            "created_at": t.created_at
        }
        for t in tasks
    ]


@router.get("/tasks/{task_id}")
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get task details"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "deadline": task.deadline,
        "estimated_hours": task.estimated_hours,
        "priority": task.priority,
        "priority_score": task.priority_score,
        "status": task.status,
        "scheduled_start": task.scheduled_start,
        "scheduled_end": task.scheduled_end,
        "tags": task.tags,
        "category": task.category,
        "created_at": task.created_at,
        "updated_at": task.updated_at
    }


@router.patch("/tasks/{task_id}")
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a task"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    # Recalculate priority score if relevant fields changed
    if any(f in update_data for f in ['deadline', 'priority', 'estimated_hours']):
        task.priority_score = schedule_optimizer.calculate_priority_score(task, datetime.now())
    
    # Set completion time if status changed to completed
    if task_data.status == TaskStatus.COMPLETED and task.status != TaskStatus.COMPLETED:
        task.completed_at = datetime.now()
    
    await db.commit()
    await db.refresh(task)
    
    return {"id": task.id, "status": "updated"}


@router.post("/optimize-schedule")
async def optimize_schedule(
    start_date: Optional[datetime] = None,
    days: int = 7,
    db: AsyncSession = Depends(get_db)
):
    """
    Generate optimized weekly schedule
    Returns scheduled blocks and deep work suggestions
    """
    start_date = start_date or datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = start_date + timedelta(days=days)
    
    # Get pending tasks
    result = await db.execute(
        select(Task).where(Task.status.in_([TaskStatus.TODO, TaskStatus.IN_PROGRESS]))
    )
    tasks = result.scalars().all()
    
    # Get existing deep work blocks
    blocks_result = await db.execute(
        select(DeepWorkBlock).where(
            DeepWorkBlock.start_time >= start_date,
            DeepWorkBlock.end_time <= end_date
        )
    )
    existing_blocks = blocks_result.scalars().all()
    existing_block_dicts = [
        {
            "start_time": b.start_time,
            "end_time": b.end_time
        }
        for b in existing_blocks
    ]
    
    # Optimize schedule
    scheduled_blocks = schedule_optimizer.find_optimal_time_slots(
        tasks=list(tasks),
        start_date=start_date,
        end_date=end_date,
        existing_blocks=existing_block_dicts
    )
    
    # Get deep work suggestions
    deep_work_suggestions = schedule_optimizer.suggest_deep_work_blocks(
        start_date=start_date,
        end_date=end_date
    )
    
    # Detect deadline risks
    risks = schedule_optimizer.detect_deadline_risks(list(tasks), datetime.now())
    
    return {
        "period": {
            "start": start_date,
            "end": end_date
        },
        "scheduled_blocks": scheduled_blocks,
        "deep_work_suggestions": deep_work_suggestions,
        "deadline_risks": risks,
        "total_tasks": len(tasks),
        "scheduled_tasks": len(scheduled_blocks)
    }


@router.get("/deadline-risks")
async def get_deadline_risks(
    db: AsyncSession = Depends(get_db)
):
    """Get tasks at risk of missing deadlines"""
    result = await db.execute(
        select(Task).where(Task.status != TaskStatus.COMPLETED)
    )
    tasks = result.scalars().all()
    
    risks = schedule_optimizer.detect_deadline_risks(list(tasks), datetime.now())
    
    return {
        "risks": risks,
        "total_at_risk": len(risks)
    }


@router.post("/deep-work-blocks")
async def create_deep_work_block(
    title: str,
    start_time: datetime,
    end_time: datetime,
    task_id: Optional[int] = None,
    focus_area: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Create a deep work block"""
    block = DeepWorkBlock(
        title=title,
        start_time=start_time,
        end_time=end_time,
        task_id=task_id,
        focus_area=focus_area
    )
    
    db.add(block)
    await db.commit()
    await db.refresh(block)
    
    return {
        "id": block.id,
        "title": block.title,
        "start_time": block.start_time,
        "end_time": block.end_time
    }
