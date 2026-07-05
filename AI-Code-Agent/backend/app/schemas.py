from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        orm_mode = True


class MessageCreate(BaseModel):
    message: str
    mode: str = "chat"
    language: str = "English"


class ChatMessage(BaseModel):
    role: str
    content: str
    created_at: Optional[datetime] = None


class ChatHistoryOut(BaseModel):
    id: int
    title: str
    created_at: datetime
    language: str
    messages: List[ChatMessage] = []

    class Config:
        orm_mode = True


class DownloadRequest(BaseModel):
    title: str
    content: str
    file_format: str = "pdf"


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    stack: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    stack: Optional[str] = None


class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    stack: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

