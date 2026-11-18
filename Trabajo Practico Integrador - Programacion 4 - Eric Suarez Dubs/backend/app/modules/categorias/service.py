from fastapi import HTTPException
from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

class CategoriaService:
    def __init__(self, uow=CategoriaUnitOfWork): self.uow = uow
    def listar(self):
        with self.uow() as u:
            rows = [x for x in u.categorias.get_all() if x.activo]
            return [CategoriaRead.model_validate(x) for x in rows]
    def obtener(self, id):
        with self.uow() as u:
            x = u.categorias.get_by_id(id)
            if not x or not x.activo: raise HTTPException(404, "Categoría no encontrada")
            return CategoriaRead.model_validate(x)
    def crear(self, data: CategoriaCreate):
        with self.uow() as u:
            if u.categorias.get_by_nombre(data.nombre): raise HTTPException(409, "Nombre de categoría duplicado")
            x = u.categorias.add(Categoria(**data.model_dump()))
            return CategoriaRead.model_validate(x)
    def actualizar(self, id, data: CategoriaUpdate):
        with self.uow() as u:
            x = u.categorias.get_by_id(id)
            if not x or not x.activo: raise HTTPException(404, "Categoría no encontrada")
            values = data.model_dump(exclude_unset=True)
            if values.get("nombre") and values["nombre"] != x.nombre and u.categorias.get_by_nombre(values["nombre"]):
                raise HTTPException(409, "Nombre de categoría duplicado")
            for k,v in values.items(): setattr(x,k,v)
            u.session.add(x); u.session.flush()
            return CategoriaRead.model_validate(x)
    def eliminar(self, id):
        with self.uow() as u:
            x = u.categorias.get_by_id(id)
            if not x or not x.activo: raise HTTPException(404, "Categoría no encontrada")
            x.activo = False; u.session.add(x)
