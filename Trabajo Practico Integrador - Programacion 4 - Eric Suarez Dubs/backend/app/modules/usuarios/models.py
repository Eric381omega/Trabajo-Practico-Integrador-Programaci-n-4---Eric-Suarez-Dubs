from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, max_length=50)
    full_name: str
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: str = Field(default="user")
    disabled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    pedidos: list["Pedido"] = Relationship(back_populates="usuario")
