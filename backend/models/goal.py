from sqlalchemy import Column, Integer, String, Date
from database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)

    goal_name = Column(String(100), nullable=False)

    goal_type = Column(String(50))

    exam_date = Column(Date)

    daily_hours = Column(Integer)

    preferred_time = Column(String(30))

    syllabus_file = Column(String(255))

    progress = Column(Integer, default=0)