"""
Meeting Summarizer API Routes
Transcript upload and summarization
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from ..database import get_db
from ..models.meetings import Meeting, Note
from ..services.ai import llm_service

router = APIRouter(prefix="/meetings", tags=["meetings"])


class MeetingCreate(BaseModel):
    title: str
    transcript: str
    meeting_date: Optional[datetime] = None
    participants: Optional[List[str]] = None


@router.post("/")
async def create_meeting(
    meeting_data: MeetingCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create and summarize a meeting from transcript
    """
    # Create meeting entry
    meeting = Meeting(
        title=meeting_data.title,
        transcript=meeting_data.transcript,
        meeting_date=meeting_data.meeting_date or datetime.now(),
        participants=meeting_data.participants or [],
        processed=1  # Processing
    )
    
    db.add(meeting)
    await db.commit()
    await db.refresh(meeting)
    
    # Summarize using LLM
    summary_data = await llm_service.summarize_meeting(meeting_data.transcript)
    
    # Update meeting with summary
    meeting.summary = summary_data.get("summary", "")
    meeting.key_points = summary_data.get("key_points", [])
    meeting.decisions = summary_data.get("decisions", [])
    meeting.action_items = summary_data.get("action_items", [])
    meeting.processed = 2  # Complete
    
    await db.commit()
    await db.refresh(meeting)
    
    return {
        "id": meeting.id,
        "title": meeting.title,
        "summary": meeting.summary,
        "key_points": meeting.key_points,
        "decisions": meeting.decisions,
        "action_items": meeting.action_items,
        "status": "complete"
    }


@router.post("/upload")
async def upload_transcript(
    title: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload transcript file (txt)
    """
    # Read transcript
    content = await file.read()
    transcript = content.decode('utf-8')
    
    # Create meeting
    meeting = Meeting(
        title=title,
        transcript=transcript,
        meeting_date=datetime.now(),
        processed=1
    )
    
    db.add(meeting)
    await db.commit()
    await db.refresh(meeting)
    
    return {
        "meeting_id": meeting.id,
        "status": "uploaded",
        "message": "Transcript uploaded. Call /meetings/{id}/process to summarize."
    }


@router.post("/{meeting_id}/process")
async def process_meeting(
    meeting_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Process and summarize a meeting"""
    result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Summarize
    summary_data = await llm_service.summarize_meeting(meeting.transcript)
    
    meeting.summary = summary_data.get("summary", "")
    meeting.key_points = summary_data.get("key_points", [])
    meeting.decisions = summary_data.get("decisions", [])
    meeting.action_items = summary_data.get("action_items", [])
    meeting.processed = 2
    
    await db.commit()
    
    return {
        "meeting_id": meeting.id,
        "summary": meeting.summary,
        "key_points": meeting.key_points,
        "decisions": meeting.decisions,
        "action_items": meeting.action_items
    }


@router.get("/{meeting_id}")
async def get_meeting(
    meeting_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get meeting details"""
    result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return {
        "id": meeting.id,
        "title": meeting.title,
        "summary": meeting.summary,
        "key_points": meeting.key_points,
        "decisions": meeting.decisions,
        "action_items": meeting.action_items,
        "meeting_date": meeting.meeting_date,
        "participants": meeting.participants,
        "processed": meeting.processed,
        "created_at": meeting.created_at
    }


@router.get("/")
async def list_meetings(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """List all meetings"""
    result = await db.execute(
        select(Meeting)
        .order_by(Meeting.meeting_date.desc())
        .offset(skip)
        .limit(limit)
    )
    meetings = result.scalars().all()
    
    return [
        {
            "id": m.id,
            "title": m.title,
            "meeting_date": m.meeting_date,
            "summary": m.summary,
            "processed": m.processed,
            "action_items_count": len(m.action_items) if m.action_items else 0
        }
        for m in meetings
    ]


# Notes endpoints
class NoteCreate(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = None
    category: Optional[str] = None


@router.post("/notes")
async def create_note(
    note_data: NoteCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a note"""
    note = Note(
        title=note_data.title,
        content=note_data.content,
        tags=note_data.tags or [],
        category=note_data.category
    )
    
    db.add(note)
    await db.commit()
    await db.refresh(note)
    
    return {
        "id": note.id,
        "title": note.title,
        "created_at": note.created_at
    }


@router.get("/notes")
async def list_notes(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """List all notes"""
    result = await db.execute(
        select(Note)
        .order_by(Note.updated_at.desc())
        .offset(skip)
        .limit(limit)
    )
    notes = result.scalars().all()
    
    return [
        {
            "id": n.id,
            "title": n.title,
            "content": n.content[:200] + "..." if len(n.content) > 200 else n.content,
            "tags": n.tags,
            "category": n.category,
            "created_at": n.created_at
        }
        for n in notes
    ]
