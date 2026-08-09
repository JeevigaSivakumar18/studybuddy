from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models.goal import Goal
from schemas.goal import GoalCreate

router = APIRouter()

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

@router.post("/goals")
def create_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db)
):
    new_goal = Goal(
        goal_name=goal.goal_name,
        goal_type=goal.goal_type,
        exam_date=goal.exam_date,
        daily_hours=goal.daily_hours,
        preferred_time=goal.preferred_time
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return {
        "message": "Goal created successfully",
        "goal_id": new_goal.id
    }