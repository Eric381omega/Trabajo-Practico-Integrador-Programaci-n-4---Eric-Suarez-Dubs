from sqlmodel import select, func
from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido

class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session): super().__init__(session, Pedido)
    def list_by_usuario(self, usuario_id, skip=0, limit=20, estado=None):
        q = select(Pedido).where(Pedido.usuario_id == usuario_id)
        if estado: q = q.where(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(q.subquery())).one()
        return total, self.session.exec(q.order_by(Pedido.created_at.desc()).offset(skip).limit(limit)).all()
    def count_by_estado(self, estado):
        return self.session.exec(select(func.count(Pedido.id)).where(Pedido.estado == estado)).one()
