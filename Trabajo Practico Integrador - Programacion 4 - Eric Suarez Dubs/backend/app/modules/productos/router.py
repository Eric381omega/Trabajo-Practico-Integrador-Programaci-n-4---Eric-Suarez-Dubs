from fastapi import APIRouter, Depends, Response
from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.productos.schemas import *
from app.modules.productos.service import ProductoService
router=APIRouter(prefix="/productos",tags=["Productos"]); svc=ProductoService()
@router.get("",response_model=ProductosPaginados)
def listar(skip:int=0,limit:int=20,search:str|None=None,categoria_id:int|None=None,disponible:bool|None=None):
    return svc.listar(skip,limit,search,categoria_id,disponible)
@router.get("/{id}",response_model=ProductoRead)
def obtener(id:int): return svc.obtener(id)
@router.post("",response_model=ProductoRead,status_code=201)
def crear(data:ProductoCreate,_:Usuario=Depends(require_role(["admin"]))): return svc.crear(data)
@router.put("/{id}",response_model=ProductoRead)
def actualizar(id:int,data:ProductoUpdate,_:Usuario=Depends(require_role(["admin"]))): return svc.actualizar(id,data)
@router.patch("/{id}/stock",response_model=ProductoRead)
def stock(id:int,data:ProductoStockUpdate,_:Usuario=Depends(require_role(["admin"]))): return svc.stock(id,data)
@router.delete("/{id}",status_code=204)
def eliminar(id:int,_:Usuario=Depends(require_role(["admin"]))): svc.eliminar(id); return Response(status_code=204)
