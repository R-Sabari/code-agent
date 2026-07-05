from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import ChatHistory, User

router = APIRouter(prefix="", tags=["admin"])


@router.get("/admin/dashboard")
def admin_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    return {
        "users": db.query(User).count(),
        "chats": db.query(ChatHistory).count(),
        "api_usage": 128,
        "stats": {"active_users": 24, "today_chats": 56},
    }


@router.get("/admin/users")
def admin_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[dict]:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return [{"id": user.id, "name": f"{user.first_name} {user.last_name}", "email": user.email, "role": user.role} for user in db.query(User).all()]


@router.delete("/admin/users/{user_id}")
def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"deleted": True}
