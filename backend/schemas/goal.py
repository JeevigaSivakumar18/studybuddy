from pydantic import BaseModel
from datetime import date

class GoalCreate(BaseModel):
    goal_name: str
    goal_type: str
    exam_date: date
    daily_hours: int
    preferred_time: str