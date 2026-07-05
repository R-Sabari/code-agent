from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import ChatHistory, Download, Project, SavedCode, Setting, User

router = APIRouter(prefix="", tags=["profile"])


@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    return {
        "id": current_user.id,
        "name": f"{current_user.first_name} {current_user.last_name}",
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "programming_languages": ["Python", "TypeScript", "Java", "C++"],
        "projects": db.query(Project).filter(Project.user_id == current_user.id).count(),
        "chat_count": db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).count(),
        "downloads": db.query(Download).filter(Download.user_id == current_user.id).count(),
        "saved_codes": db.query(SavedCode).filter(SavedCode.user_id == current_user.id).count(),
        "settings": db.query(Setting).filter(Setting.user_id == current_user.id).first(),
    }
