from fastapi import APIRouter, Depends
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from app.modules.pedidos.schemas import *
from app.modules.pedidos.service import PedidoService
router=APIRouter(prefix="/pedidos",tags=["Pedidos"]); svc=PedidoService()
@router.post("",response_model=PedidoRead,status_code=201)
def crear(data:PedidoCreate,user:Usuario=Depends(get_current_active_user)): return svc.crear(user,data)
@router.get("",response_model=PedidosPaginados)
def listar(skip:int=0,limit:int=20,estado:str|None=None,user:Usuario=Depends(get_current_active_user)):
    return svc.listar(user,user.role=="admin",skip,limit,estado)
@router.get("/resumen",response_model=ResumenPedidos)
def resumen(_:Usuario=Depends(require_role(["admin"]))): return svc.resumen()
@router.get("/{id}",response_model=PedidoRead)
def obtener(id:int,user:Usuario=Depends(get_current_active_user)): return svc.obtener(id,user,user.role=="admin")
@router.patch("/{id}/estado",response_model=PedidoRead)
def cambiar(id:int,data:CambioEstado,_:Usuario=Depends(require_role(["admin"]))): return svc.cambiar_estado(id,data.estado)
@router.patch("/{id}/cancelar",response_model=PedidoRead)
def cancelar(id:int,user:Usuario=Depends(get_current_active_user)): return svc.cancelar_cliente(id,user)
