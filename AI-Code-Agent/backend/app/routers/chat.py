from typing import Any
from fastapi import APIRouter, Depends, Response
from fpdf import FPDF
from sqlalchemy.orm import Session

from app.ai_service import generate_ai_response
from app.auth import get_current_user
from app.database import get_db
from app.models import ChatHistory, Download, Message, User
from app.schemas import ChatHistoryOut, ChatMessage, DownloadRequest, MessageCreate

router = APIRouter(prefix="", tags=["chat"])


@router.post("/chat")
def chat(
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    new_session: bool = False,
) -> dict[str, Any]:
    conversation = None
    if not new_session:
        conversation = (
            db.query(ChatHistory)
            .filter(ChatHistory.user_id == current_user.id)
            .order_by(ChatHistory.created_at.desc())
            .first()
        )
    if conversation is None:
        conversation = ChatHistory(title=payload.message[:40], user_id=current_user.id, language=payload.language)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    reply = generate_ai_response(payload.message, mode=payload.mode)

    conversation.title = payload.message[:60] if payload.message else "New Chat"
    db.add(Message(chat_history_id=conversation.id, role="user", content=payload.message))
    db.add(Message(chat_history_id=conversation.id, role="assistant", content=reply))
    db.commit()

    return {"reply": reply, "chat_id": conversation.id}


@router.post("/generate-code")
def generate_code(payload: MessageCreate, current_user: User = Depends(get_current_user)) -> dict[str, Any]:
    reply = generate_ai_response(payload.message, mode="generate-code")
    return {"reply": reply}


@router.post("/debug")
def debug(payload: MessageCreate, current_user: User = Depends(get_current_user)) -> dict[str, Any]:
    reply = generate_ai_response(payload.message, mode="debug")
    return {"reply": reply}


@router.post("/explain")
def explain(payload: MessageCreate, current_user: User = Depends(get_current_user)) -> dict[str, Any]:
    reply = generate_ai_response(payload.message, mode="explain")
    return {"reply": reply}


@router.post("/optimize")
def optimize(payload: MessageCreate, current_user: User = Depends(get_current_user)) -> dict[str, Any]:
    reply = generate_ai_response(payload.message, mode="optimize")
    return {"reply": reply}


@router.post("/download-pdf")
def download_pdf(payload: DownloadRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Response:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 8, payload.title)
    pdf.ln(2)
    pdf.multi_cell(0, 6, payload.content)

    content = pdf.output(dest="S").encode("latin-1")
    db.add(Download(user_id=current_user.id, filename=f"{payload.title[:20]}.pdf", format="pdf"))
    db.commit()

    return Response(content=content, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={payload.title[:20]}.pdf"})


@router.get("/history", response_model=list[ChatHistoryOut])
def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ChatHistoryOut]:
    histories = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .all()
    )
    result = []
    for history in histories:
        result.append(
            ChatHistoryOut(
                id=history.id,
                title=history.title,
                created_at=history.created_at,
                language=history.language,
                messages=[
                    ChatMessage(role=message.role, content=message.content, created_at=message.created_at)
                    for message in history.messages
                ],
            )
        )
    return result
