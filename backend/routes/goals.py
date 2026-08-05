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
    return {
        "message": "Route Working!",
        "goal": goal
    }