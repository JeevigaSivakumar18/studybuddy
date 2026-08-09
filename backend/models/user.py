from sqlalchemy import Column, Integer, String, Text
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100))

    email = Column(String(150), unique=True, nullable=False)

    password_hash = Column(Text, nullable=False)