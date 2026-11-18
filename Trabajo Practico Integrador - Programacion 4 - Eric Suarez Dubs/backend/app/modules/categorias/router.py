from fastapi import APIRouter, Depends, Response
from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.categorias.schemas import *
from app.modules.categorias.service import CategoriaService
router=APIRouter(prefix="/categorias",tags=["Categorías"]); svc=CategoriaService()
@router.get("",response_model=list[CategoriaRead])
def listar(): return svc.listar()
@router.get("/{id}",response_model=CategoriaRead)
def obtener(id:int): return svc.obtener(id)
@router.post("",response_model=CategoriaRead,status_code=201)
def crear(data:CategoriaCreate,_:Usuario=Depends(require_role(["admin"]))): return svc.crear(data)
@router.put("/{id}",response_model=CategoriaRead)
def actualizar(id:int,data:CategoriaUpdate,_:Usuario=Depends(require_role(["admin"]))): return svc.actualizar(id,data)
@router.delete("/{id}",status_code=204)
def eliminar(id:int,_:Usuario=Depends(require_role(["admin"]))): svc.eliminar(id); return Response(status_code=204)
