from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id", ondelete="CASCADE"), nullable=False)
    topic = Column(String(200), nullable=False)
    difficulty = Column(String(20))
    priority_score = Column(Integer)
    start_day_offset = Column(Integer)
    end_day_offset = Column(Integer)
    daily_hours = Column(Integer)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())