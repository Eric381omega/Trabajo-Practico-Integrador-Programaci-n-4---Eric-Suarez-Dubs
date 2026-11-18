from fastapi import APIRouter, Depends
from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
router=APIRouter(prefix="/admin/usuarios",tags=["Usuarios"])
svc=UsuarioService()
@router.get("",response_model=list[UserPublic])
def listar(_:Usuario=Depends(require_role(["admin"]))): return svc.listar()
@router.post("/{id}/activar",response_model=UserPublic)
def activar(id:int,_:Usuario=Depends(require_role(["admin"]))): return svc.activar(id)
@router.post("/{id}/desactivar",response_model=UserPublic)
def desactivar(id:int,actual:Usuario=Depends(require_role(["admin"]))): return svc.desactivar(id,actual)
