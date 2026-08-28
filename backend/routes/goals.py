from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session
from services.pdf_extractor import extract_text_from_pdf
from services.topic_extractor import extract_topics
from services.difficulty import assess_difficulty
from services.study_plan import calculate_priorities, generate_roadmap
from pathlib import Path
from datetime import date
import shutil

from database import SessionLocal
from models.goal import Goal
from models.roadmap_item import RoadmapItem

from services.adaptive_scheduler import reschedule_roadmap

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def recalculate_goal_progress(db: Session, goal_id: int):
    """
    Recalculate a goal's progress percentage based on completed roadmap items.
    Called automatically whenever a roadmap item status changes.
    """
    total_items = db.query(RoadmapItem).filter(RoadmapItem.goal_id == goal_id).count()
    if total_items == 0:
        return

    completed_items = (
        db.query(RoadmapItem)
        .filter(RoadmapItem.goal_id == goal_id, RoadmapItem.status == "completed")
        .count()
    )

    progress_percent = int((completed_items / total_items) * 100)

    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if goal:
        goal.progress = progress_percent
        db.commit()


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

    # Save uploaded syllabus
    filename = Path(syllabus.filename).name
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(syllabus.file, buffer)

    # Create goal record
    new_goal = Goal(
        user_id=1,
        goal_name=goal_name,
        goal_type=goal_type,
        exam_date=exam_date,
        daily_hours=daily_hours,
        preferred_time=preferred_time,
        syllabus_file=str(file_path),
        progress=0
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    # Extract text, topics, difficulty, priorities, and roadmap
    extracted_text = extract_text_from_pdf(str(file_path))
    topics = extract_topics(extracted_text)
    difficulties = assess_difficulty(topics, extracted_text)
    priorities = calculate_priorities(difficulties)
    roadmap = generate_roadmap(priorities, exam_date, daily_hours)

    # Save roadmap items to database
    for item in roadmap:
        roadmap_item = RoadmapItem(
            goal_id=new_goal.id,
            topic=item["topic"],
            difficulty=item["difficulty"],
            priority_score=item["priority_score"],
            start_day_offset=item["start_day_offset"],
            end_day_offset=item["end_day_offset"],
            daily_hours=item["daily_hours"],
            status=item["status"]
        )
        db.add(roadmap_item)

    db.commit()

    return {
        "message": "Goal created successfully",
        "goal_id": new_goal.id,
        "syllabus_file": str(file_path),
        "extracted_text": extracted_text,
        "topics": topics,
        "difficulties": difficulties,
        "priorities": priorities,
        "roadmap": roadmap
    }


@router.get("/goals")
def get_goals(db: Session = Depends(get_db)):
    goals = db.query(Goal).filter(Goal.user_id == 1).all()
    return goals


@router.get("/goals/{goal_id}/roadmap")
def get_roadmap(goal_id: int, db: Session = Depends(get_db)):
    items = db.query(RoadmapItem).filter(RoadmapItem.goal_id == goal_id).all()
    return {
        "goal_id": goal_id,
        "roadmap": [
            {
                "id": item.id,
                "topic": item.topic,
                "difficulty": item.difficulty,
                "priority_score": item.priority_score,
                "start_day_offset": item.start_day_offset,
                "end_day_offset": item.end_day_offset,
                "daily_hours": item.daily_hours,
                "status": item.status
            }
            for item in items
        ]
    }


@router.patch("/goals/{goal_id}/roadmap/{item_id}")
def update_roadmap_item_status(
    goal_id: int,
    item_id: int,
    status: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Update the status of a single roadmap item.
    Valid statuses: pending, in_progress, completed
    Automatically recalculates the parent goal's progress.
    """
    valid_statuses = {"pending", "in_progress", "completed"}
    if status not in valid_statuses:
        return {"error": f"Invalid status. Must be one of: {valid_statuses}"}

    item = (
        db.query(RoadmapItem)
        .filter(RoadmapItem.id == item_id, RoadmapItem.goal_id == goal_id)
        .first()
    )

    if not item:
        return {"error": "Roadmap item not found"}

    item.status = status
    db.commit()

    # Recalculate overall goal progress
    recalculate_goal_progress(db, goal_id)

    return {
        "message": "Status updated successfully",
        "item_id": item_id,
        "new_status": status
    }

@router.post("/goals/{goal_id}/reschedule")
def reschedule_goal(goal_id: int, db: Session = Depends(get_db)):
    """
    Recalculate the study roadmap based on current progress and days remaining.
    Completed topics stay fixed. Remaining topics get redistributed.
    """
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        return {"error": "Goal not found"}

    items = db.query(RoadmapItem).filter(RoadmapItem.goal_id == goal_id).all()

    # Run the rescheduling algorithm
    updated_items = reschedule_roadmap(items, goal.exam_date)

    # Save updated offsets back to the database
    for item in updated_items:
        db.add(item)

    db.commit()

    # Return the fresh roadmap
    return get_roadmap(goal_id, db)