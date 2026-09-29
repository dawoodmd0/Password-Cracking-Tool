from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    hash_algorithm = Column(String, default="SHA-256")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AttackResult(Base):
    __tablename__ = "attack_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    attack_type = Column(String)
    target_hash = Column(String)
    status = Column(String)
    attempts = Column(Integer)
    time_taken = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
