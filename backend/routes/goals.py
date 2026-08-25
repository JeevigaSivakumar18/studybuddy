from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session
from services.pdf_extractor import extract_text_from_pdf
from services.topic_extractor import extract_topics
from pathlib import Path
from datetime import date
import shutil

from database import SessionLocal
from models.goal import Goal

from services.difficulty import assess_difficulty


router = APIRouter()


# -----------------------------
# Upload folder
# -----------------------------

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# -----------------------------
# Database dependency
# -----------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# -----------------------------
# CREATE GOAL
# -----------------------------

@router.post("/goals")
def create_goal(
    goal_name: str = Form(...),
    goal_type: str = Form(...),
    exam_date: date = Form(...),
    daily_hours: int = Form(...),
    preferred_time: str = Form(...),
    syllabus: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # -----------------------------
    # Save uploaded syllabus
    # -----------------------------

    filename = Path(syllabus.filename).name

    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(syllabus.file, buffer)

    # -----------------------------
    # Create database record
    # -----------------------------

    new_goal = Goal(
        user_id=1,  # temporary user for testing

        goal_name=goal_name,
        goal_type=goal_type,
        exam_date=exam_date,
        daily_hours=daily_hours,
        preferred_time=preferred_time,

        syllabus_file=str(file_path),

        progress=0
    )

    # -----------------------------
    # Save to MySQL
    # -----------------------------

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    extracted_text = extract_text_from_pdf(str(file_path))
    topics = extract_topics(extracted_text)

    difficulty = assess_difficulty(topics)

    return {
        "message": "Goal created successfully",
        "goal_id": new_goal.id,
        "syllabus_file": str(file_path),
        "extracted_text": extracted_text,
        "topics": topics,
        "difficulty": difficulty

    }


# -----------------------------
# GET ALL GOALS
# -----------------------------

@router.get("/goals")
def get_goals(
    db: Session = Depends(get_db)
):

    goals = db.query(Goal).filter(
        Goal.user_id == 1
    ).all()

    return goals