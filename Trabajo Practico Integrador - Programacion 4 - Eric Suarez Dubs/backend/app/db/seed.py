from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto

def seed():
    create_all_tables()
    with session_factory() as s:
        admin=s.query(Usuario).filter(Usuario.username=="admin").first()
        if not admin:
            s.add(Usuario(username="admin",full_name="Administrador Food Store",email="admin@example.com",
                hashed_password=hash_password("Admin1234!"),role="admin",disabled=False))
        categorias_data=[
            ("Hamburguesas","Hamburguesas y sándwiches"),
            ("Pizzas","Pizzas artesanales"),
            ("Bebidas","Bebidas frías")
        ]
        cats={}
        for nombre,desc in categorias_data:
            c=s.query(Categoria).filter(Categoria.nombre==nombre).first()
            if not c:
                c=Categoria(nombre=nombre,descripcion=desc,activo=True); s.add(c); s.flush()
            cats[nombre]=c
        productos=[
            ("Hamburguesa clásica","Carne, lechuga y tomate",4500,12,"Hamburguesas"),
            ("Hamburguesa doble","Doble carne y cheddar",5900,10,"Hamburguesas"),
            ("Hamburguesa veggie","Medallón vegetal",4800,8,"Hamburguesas"),
            ("Pizza muzzarella","Muzzarella y salsa",7500,10,"Pizzas"),
            ("Pizza napolitana","Tomate y ajo",8200,8,"Pizzas"),
            ("Pizza especial","Jamón, morrones y huevo",9200,7,"Pizzas"),
            ("Gaseosa cola","Botella 1.5 litros",2200,20,"Bebidas"),
            ("Agua mineral","Botella 500 ml",1200,25,"Bebidas"),
        ]
        for nombre,desc,precio,stock,cat in productos:
            p=s.query(Producto).filter(Producto.nombre==nombre).first()
            if not p:
                s.add(Producto(categoria_id=cats[cat].id,nombre=nombre,descripcion=desc,precio_base=precio,
                    imagen_url="",stock=stock,disponible=True,activo=True))
        s.commit()
    print("Seed completado. Usuario: admin / Admin1234!")

if __name__=="__main__": seed()
