import {Link,useNavigate} from 'react-router-dom'
import {useAuthStore} from '../../store/authStore'
import {useCartStore} from '../../store/cartStore'
export function Navbar(){
 const user=useAuthStore(s=>s.user),logout=useAuthStore(s=>s.logout),count=useCartStore(s=>s.items.reduce((n,i)=>n+i.cantidad,0)),nav=useNavigate()
 async function salir(){await logout();nav('/login')}
 return <nav><strong>🍔 Food Store</strong><Link to="/">Catálogo</Link><Link to="/carrito">Carrito ({count})</Link>{user&&<><Link to="/mis-pedidos">Mis pedidos</Link><span>{user.full_name} ({user.role})</span></>}{user?.role==='admin'&&<><Link to="/admin/resumen">Panel</Link><Link to="/admin/categorias">Categorías</Link><Link to="/admin/productos">Productos</Link><Link to="/admin/pedidos">Pedidos</Link><Link to="/admin/usuarios">Usuarios</Link></>}{user?<button onClick={salir}>Salir</button>:<><Link to="/login">Ingresar</Link><Link to="/register">Registrarse</Link></>}</nav>
}
