from collections.abc import Generator
from fastapi import Depends, HTTPException, Request, status
from sqlmodel import Session, select
from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario

def get_session() -> Generator[Session, None, None]:
    with session_factory() as session:
        yield session

def get_current_user(request: Request, session: Session = Depends(get_session)) -> Usuario:
    token = request.cookies.get("access_token")
    username = decode_access_token(token) if token else None
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")
    user = session.exec(select(Usuario).where(Usuario.username == username)).first()
    if not user:
        raise HTTPException(status_code=401, detail="No autenticado")
    return user

def get_current_active_user(user: Usuario = Depends(get_current_user)) -> Usuario:
    if user.disabled:
        raise HTTPException(status_code=400, detail="Cuenta de usuario desactivada")
    return user

def require_role(roles: list[str]):
    def checker(user: Usuario = Depends(get_current_active_user)) -> Usuario:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="No tiene permisos para esta operación")
        return user
    return checker
