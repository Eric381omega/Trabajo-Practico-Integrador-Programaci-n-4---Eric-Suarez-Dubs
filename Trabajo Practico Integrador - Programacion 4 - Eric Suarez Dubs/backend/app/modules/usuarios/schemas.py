from datetime import datetime
from pydantic import EmailStr, Field as PField
from sqlmodel import SQLModel

class UserCreate(SQLModel):
    username: str = PField(min_length=3, max_length=50)
    full_name: str = PField(min_length=2, max_length=120)
    email: EmailStr
    password: str = PField(min_length=8)

class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: EmailStr
    role: str
    disabled: bool
    created_at: datetime
