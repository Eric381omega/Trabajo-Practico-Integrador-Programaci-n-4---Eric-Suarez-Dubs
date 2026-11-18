from sqlmodel import select, func
from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto

class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session): super().__init__(session, Producto)
    def search(self, skip=0, limit=20, search=None, categoria_id=None, disponible=None):
        q = select(Producto).where(Producto.activo == True)
        if search: q = q.where(Producto.nombre.ilike(f"%{search}%"))
        if categoria_id is not None: q = q.where(Producto.categoria_id == categoria_id)
        if disponible is not None: q = q.where(Producto.disponible == disponible)
        total = self.session.exec(select(func.count()).select_from(q.subquery())).one()
        items = self.session.exec(q.offset(skip).limit(limit)).all()
        return total, items
