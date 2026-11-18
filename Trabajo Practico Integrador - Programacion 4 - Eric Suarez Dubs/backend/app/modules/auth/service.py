from fastapi import HTTPException
from app.core.security import hash_password, verify_password, create_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.repository import UsuarioRepository
from app.core.database import session_factory

class AuthService:
    def register(self,data: UserCreate):
        with session_factory() as s:
            repo=UsuarioRepository(s)
            if repo.get_by_username(data.username) or repo.get_by_email(data.email):
                raise HTTPException(409,"El username o email ya existe")
            u=Usuario(username=data.username,full_name=data.full_name,email=data.email,
                hashed_password=hash_password(data.password),role="user")
            s.add(u); s.commit(); s.refresh(u)
            return UserPublic.model_validate(u)
    def login(self,username,password):
        with session_factory() as s:
            u=UsuarioRepository(s).get_by_username(username)
            if not u or not verify_password(password,u.hashed_password):
                raise HTTPException(401,"Credenciales incorrectas")
            if u.disabled: raise HTTPException(400,"Cuenta de usuario desactivada")
            return create_access_token(u.username)
