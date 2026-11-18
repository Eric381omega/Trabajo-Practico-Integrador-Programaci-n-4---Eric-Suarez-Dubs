from fastapi import HTTPException
from app.core.database import session_factory
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.schemas import UserPublic

class UsuarioService:
    def listar(self):
        with session_factory() as s: return [UserPublic.model_validate(x) for x in UsuarioRepository(s).get_all()]
    def activar(self,id):
        with session_factory() as s:
            u=s.get(Usuario,id)
            if not u: raise HTTPException(404,"Usuario no encontrado")
            u.disabled=False; s.add(u); s.commit(); s.refresh(u); return UserPublic.model_validate(u)
    def desactivar(self,id,actual):
        if id==actual.id: raise HTTPException(400,"No puede desactivarse a sí mismo")
        with session_factory() as s:
            u=s.get(Usuario,id)
            if not u: raise HTTPException(404,"Usuario no encontrado")
            u.disabled=True; s.add(u); s.commit(); s.refresh(u); return UserPublic.model_validate(u)
