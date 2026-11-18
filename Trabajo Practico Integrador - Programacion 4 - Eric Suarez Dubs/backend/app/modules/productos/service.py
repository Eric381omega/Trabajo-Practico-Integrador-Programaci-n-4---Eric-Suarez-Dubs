from fastapi import HTTPException
from app.modules.productos.models import Producto
from app.modules.productos.schemas import *
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.categorias.models import Categoria

class ProductoService:
    def __init__(self, uow=ProductoUnitOfWork): self.uow=uow
    def listar(self, skip=0, limit=20, search=None, categoria_id=None, disponible=None):
        with self.uow() as u:
            total, rows = u.productos.search(skip, min(limit,100), search, categoria_id, disponible)
            result=[]
            for p in rows:
                u.session.refresh(p, attribute_names=["categoria"])
                result.append(ProductoRead.model_validate(p))
            return ProductosPaginados(total=total, items=result)
    def obtener(self,id):
        with self.uow() as u:
            p=u.productos.get_by_id(id)
            if not p or not p.activo: raise HTTPException(404,"Producto no encontrado")
            u.session.refresh(p, attribute_names=["categoria"])
            return ProductoRead.model_validate(p)
    def crear(self,data):
        with self.uow() as u:
            c=u.session.get(Categoria,data.categoria_id)
            if not c or not c.activo: raise HTTPException(404,"Categoría no encontrada")
            p=u.productos.add(Producto(**data.model_dump()))
            u.session.refresh(p, attribute_names=["categoria"])
            return ProductoRead.model_validate(p)
    def actualizar(self,id,data):
        with self.uow() as u:
            p=u.productos.get_by_id(id)
            if not p or not p.activo: raise HTTPException(404,"Producto no encontrado")
            vals=data.model_dump(exclude_unset=True)
            if "categoria_id" in vals:
                c=u.session.get(Categoria,vals["categoria_id"])
                if not c or not c.activo: raise HTTPException(404,"Categoría no encontrada")
            for k,v in vals.items(): setattr(p,k,v)
            u.session.add(p); u.session.flush(); u.session.refresh(p,attribute_names=["categoria"])
            return ProductoRead.model_validate(p)
    def stock(self,id,data):
        with self.uow() as u:
            p=u.productos.get_by_id(id)
            if not p or not p.activo: raise HTTPException(404,"Producto no encontrado")
            p.stock=data.stock; p.disponible=data.disponible
            u.session.add(p); u.session.flush(); u.session.refresh(p,attribute_names=["categoria"])
            return ProductoRead.model_validate(p)
    def eliminar(self,id):
        with self.uow() as u:
            p=u.productos.get_by_id(id)
            if not p or not p.activo: raise HTTPException(404,"Producto no encontrado")
            p.activo=False; u.session.add(p)
