from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    password_hash: str
    hash_algorithm: str
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class AttackRequest(BaseModel):
    target_hash: str

class AttackResultResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    attack_type: str
    target_hash: str
    status: str
    attempts: int
    time_taken: float
    created_at: datetime

    class Config:
        from_attributes = True
