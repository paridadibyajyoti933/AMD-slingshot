"""
Schedule Optimizer Service
Implements scheduling algorithm for deep work blocks
"""
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional
from ...models.tasks import Task, TaskPriority


class ScheduleOptimizer:
    """Service for optimizing weekly schedules"""
    
    # Energy levels throughout the day
    ENERGY_CURVE = {
        6: 0.6, 7: 0.7, 8: 0.8, 9: 0.9, 10: 1.0,  # Morning peak
        11: 0.9, 12: 0.7, 13: 0.6, 14: 0.5,        # Post-lunch dip
        15: 0.7, 16: 0.8, 17: 0.8, 18: 0.7,        # Afternoon recovery
        19: 0.6, 20: 0.5, 21: 0.4, 22: 0.3         # Evening decline
    }
    
    @staticmethod
    def calculate_priority_score(task: Task, current_time: datetime) -> float:
        """
        Calculate priority score for a task
        
        Factors:
        - Time until deadline (urgency)
        - Estimated effort
        - Explicit priority level
        - Current status
        
        Returns:
            Priority score (higher = more urgent)
        """
        score = 0.0
        
        # Base priority from enum
        priority_weights = {
            TaskPriority.LOW: 1.0,
            TaskPriority.MEDIUM: 2.0,
            TaskPriority.HIGH: 3.0,
            TaskPriority.URGENT: 5.0
        }
        score += priority_weights.get(task.priority, 1.0) * 10
        
        # Deadline urgency
        if task.deadline:
            # Ensure both datetimes are naive for comparison (SQLite compatibility)
            deadline = task.deadline.replace(tzinfo=None) if task.deadline.tzinfo else task.deadline
            current = current_time.replace(tzinfo=None) if current_time.tzinfo else current_time
            time_until_deadline = (deadline - current).total_seconds() / 3600  # hours
            
            if time_until_deadline < 0:
                # Overdue
                score += 100
            elif time_until_deadline < 24:
                # Due within 24 hours
                score += 50
            elif time_until_deadline < 72:
                # Due within 3 days
                score += 30
            elif time_until_deadline < 168:
                # Due within a week
                score += 15
            else:
                # More than a week
                score += 5
        
        # Effort factor (longer tasks get slight boost to start early)
        if task.estimated_hours:
            score += min(task.estimated_hours * 2, 10)
        
        return score
    
    @staticmethod
    def find_optimal_time_slots(
        tasks: List[Task],
        start_date: datetime,
        end_date: datetime,
        work_hours_start: int = 9,
        work_hours_end: int = 18,
        existing_blocks: List[Dict] = None
    ) -> List[Dict]:
        """
        Find optimal time slots for tasks
        
        Args:
            tasks: List of tasks to schedule
            start_date: Week start date
            end_date: Week end date
            work_hours_start: Start of work day (hour)
            work_hours_end: End of work day (hour)
            existing_blocks: Already scheduled blocks
            
        Returns:
            List of scheduled blocks with task assignments
        """
        scheduled_blocks = []
        existing_blocks = existing_blocks or []
        
        # Calculate priority scores
        current_time = datetime.now()
        task_scores = [
            (task, ScheduleOptimizer.calculate_priority_score(task, current_time))
            for task in tasks
        ]
        
        # Sort by priority (highest first)
        task_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Generate available time slots
        current_day = start_date
        while current_day <= end_date:
            # Skip weekends (optional)
            if current_day.weekday() < 5:  # Monday = 0, Friday = 4
                for hour in range(work_hours_start, work_hours_end):
                    slot_start = current_day.replace(hour=hour, minute=0, second=0)
                    slot_end = slot_start + timedelta(hours=1)
                    
                    # Check if slot is available
                    if not ScheduleOptimizer._is_slot_occupied(slot_start, slot_end, existing_blocks + scheduled_blocks):
                        # Try to assign highest priority task that fits
                        for task, score in task_scores:
                            if task.estimated_hours and task.estimated_hours <= 1:
                                # Task fits in this slot
                                energy_level = ScheduleOptimizer.ENERGY_CURVE.get(hour, 0.5)
                                
                                scheduled_blocks.append({
                                    "task_id": task.id,
                                    "task_title": task.title,
                                    "start_time": slot_start,
                                    "end_time": slot_end,
                                    "energy_level": "high" if energy_level >= 0.8 else "medium" if energy_level >= 0.6 else "low",
                                    "priority_score": score
                                })
                                
                                # Remove task from list
                                task_scores.remove((task, score))
                                break
            
            current_day += timedelta(days=1)
        
        return scheduled_blocks
    
    @staticmethod
    def suggest_deep_work_blocks(
        start_date: datetime,
        end_date: datetime,
        min_duration_hours: int = 2,
        max_blocks_per_day: int = 2
    ) -> List[Dict]:
        """
        Suggest deep work time blocks based on energy levels
        
        Returns:
            List of suggested deep work blocks
        """
        suggestions = []
        current_day = start_date
        
        while current_day <= end_date:
            if current_day.weekday() < 5:  # Weekdays only
                blocks_today = 0
                
                # Morning deep work (9-11 AM)
                if blocks_today < max_blocks_per_day:
                    suggestions.append({
                        "title": "Morning Deep Work",
                        "start_time": current_day.replace(hour=9, minute=0),
                        "end_time": current_day.replace(hour=11, minute=0),
                        "energy_level": "high",
                        "focus_area": "Complex problem-solving"
                    })
                    blocks_today += 1
                
                # Afternoon deep work (15-17 PM)
                if blocks_today < max_blocks_per_day:
                    suggestions.append({
                        "title": "Afternoon Deep Work",
                        "start_time": current_day.replace(hour=15, minute=0),
                        "end_time": current_day.replace(hour=17, minute=0),
                        "energy_level": "medium",
                        "focus_area": "Implementation & execution"
                    })
                    blocks_today += 1
            
            current_day += timedelta(days=1)
        
        return suggestions
    
    @staticmethod
    def detect_deadline_risks(tasks: List[Task], current_time: datetime) -> List[Dict]:
        """
        Detect tasks at risk of missing deadlines
        
        Returns:
            List of risk alerts
        """
        risks = []
        
        for task in tasks:
            if not task.deadline or task.status == "completed":
                continue
            
            time_remaining = (task.deadline - current_time).total_seconds() / 3600  # hours
            
            risk_level = None
            if time_remaining < 0:
                risk_level = "overdue"
            elif time_remaining < 24:
                risk_level = "critical"
            elif time_remaining < 72:
                risk_level = "high"
            elif task.estimated_hours and time_remaining < task.estimated_hours * 1.5:
                risk_level = "medium"
            
            if risk_level:
                risks.append({
                    "task_id": task.id,
                    "task_title": task.title,
                    "deadline": task.deadline,
                    "time_remaining_hours": max(0, time_remaining),
                    "estimated_hours": task.estimated_hours,
                    "risk_level": risk_level,
                    "message": ScheduleOptimizer._get_risk_message(risk_level, time_remaining)
                })
        
        return risks
    
    @staticmethod
    def _is_slot_occupied(
        start: datetime,
        end: datetime,
        blocks: List[Dict]
    ) -> bool:
        """Check if a time slot overlaps with existing blocks"""
        for block in blocks:
            block_start = block.get("start_time")
            block_end = block.get("end_time")
            
            if block_start and block_end:
                if not (end <= block_start or start >= block_end):
                    return True
        
        return False
    
    @staticmethod
    def _get_risk_message(risk_level: str, hours_remaining: float) -> str:
        """Generate risk message"""
        if risk_level == "overdue":
            return "⚠️ This task is overdue!"
        elif risk_level == "critical":
            return f"🔴 Critical: Due in {int(hours_remaining)} hours"
        elif risk_level == "high":
            return f"🟠 High risk: Due in {int(hours_remaining / 24)} days"
        elif risk_level == "medium":
            return "🟡 Limited time buffer remaining"
        return ""


# Global instance
schedule_optimizer = ScheduleOptimizer()
