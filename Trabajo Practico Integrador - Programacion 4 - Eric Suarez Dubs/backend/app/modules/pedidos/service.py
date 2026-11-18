from datetime import datetime, date
from fastapi import HTTPException
from sqlmodel import select, func
from app.modules.pedidos.models import Pedido, DetallePedido
from app.modules.pedidos.schemas import *
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork

TRANSICIONES = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(), "CANCELADO": set()
}

class PedidoService:
    def __init__(self,uow=PedidoUnitOfWork): self.uow=uow
    def crear(self, usuario, data):
        if data.forma_pago not in {"EFECTIVO","TRANSFERENCIA"}: raise HTTPException(422,"Forma de pago inválida")
        ids=[i.producto_id for i in data.items]
        if len(ids)!=len(set(ids)): raise HTTPException(400,"Producto repetido en el pedido")
        with self.uow() as u:
            pedido=Pedido(usuario_id=usuario.id,forma_pago=data.forma_pago,direccion_entrega=data.direccion_entrega,notas=data.notas,total=0)
            u.session.add(pedido); u.session.flush()
            total=0.0
            for item in data.items:
                p=u.productos.get_by_id(item.producto_id)
                if not p or not p.activo: raise HTTPException(404,"Producto no encontrado o inactivo")
                if not p.disponible: raise HTTPException(400,"Producto no disponible")
                if p.stock < item.cantidad: raise HTTPException(400,f"Stock insuficiente para {p.nombre}")
                p.stock -= item.cantidad
                u.session.add(p)
                subtotal=float(p.precio_base)*item.cantidad
                u.session.add(DetallePedido(pedido_id=pedido.id,producto_id=p.id,cantidad=item.cantidad,
                    nombre_producto=p.nombre,precio_unitario=p.precio_base,subtotal=subtotal))
                total += subtotal
            pedido.total=total; pedido.updated_at=datetime.utcnow()
            u.session.add(pedido); u.session.flush(); u.session.refresh(pedido)
            return PedidoRead.model_validate(pedido)
    def listar(self, usuario, admin=False, skip=0, limit=20, estado=None):
        with self.uow() as u:
            if admin:
                q=select(Pedido)
                if estado: q=q.where(Pedido.estado==estado)
                total=u.session.exec(select(func.count()).select_from(q.subquery())).one()
                rows=u.session.exec(q.order_by(Pedido.created_at.desc()).offset(skip).limit(min(limit,100))).all()
            else:
                total,rows=u.pedidos.list_by_usuario(usuario.id,skip,min(limit,100),estado)
            return PedidosPaginados(total=total,items=[PedidoRead.model_validate(p) for p in rows])
    def obtener(self,id,usuario,admin=False):
        with self.uow() as u:
            p=u.pedidos.get_by_id(id)
            if not p: raise HTTPException(404,"Pedido no encontrado")
            if not admin and p.usuario_id != usuario.id: raise HTTPException(403,"Pedido ajeno")
            return PedidoRead.model_validate(p)
    def cambiar_estado(self,id,estado):
        if estado not in TRANSICIONES: raise HTTPException(400,"Estado inválido")
        with self.uow() as u:
            p=u.pedidos.get_by_id(id)
            if not p: raise HTTPException(404,"Pedido no encontrado")
            if estado not in TRANSICIONES[p.estado]: raise HTTPException(400,"Transición inválida")
            if estado=="CANCELADO":
                for line in p.items:
                    prod=u.productos.get_by_id(line.producto_id)
                    if prod: prod.stock += line.cantidad; u.session.add(prod)
            p.estado=estado; p.updated_at=datetime.utcnow(); u.session.add(p); u.session.flush(); u.session.refresh(p)
            return PedidoRead.model_validate(p)
    def cancelar_cliente(self,id,usuario):
        with self.uow() as u:
            p=u.pedidos.get_by_id(id)
            if not p: raise HTTPException(404,"Pedido no encontrado")
            if p.usuario_id != usuario.id: raise HTTPException(403,"Pedido ajeno")
            if p.estado!="PENDIENTE": raise HTTPException(400,"Solo se cancelan pedidos pendientes")
            for line in p.items:
                prod=u.productos.get_by_id(line.producto_id)
                if prod: prod.stock += line.cantidad; u.session.add(prod)
            p.estado="CANCELADO"; p.updated_at=datetime.utcnow(); u.session.add(p); u.session.flush(); u.session.refresh(p)
            return PedidoRead.model_validate(p)
    def resumen(self):
        with self.uow() as u:
            counts={s:u.pedidos.count_by_estado(s) for s in TRANSICIONES}
            hoy=datetime.utcnow().date()
            pedidos_hoy=u.session.exec(select(func.count(Pedido.id)).where(func.date(Pedido.created_at)==hoy)).one()
            ingresos=u.session.exec(select(func.coalesce(func.sum(Pedido.total),0)).where(Pedido.estado=="ENTREGADO")).one()
            return ResumenPedidos(pendientes=counts["PENDIENTE"],en_preparacion=counts["EN_PREPARACION"],
                entregados=counts["ENTREGADO"],cancelados=counts["CANCELADO"],pedidos_hoy=pedidos_hoy,
                ingresos_entregados=float(ingresos or 0))
