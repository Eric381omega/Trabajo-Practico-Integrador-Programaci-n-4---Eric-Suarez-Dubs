import {Navigate,Outlet} from 'react-router-dom'
import {useAuthStore} from '../store/authStore'
export function ProtectedRoute({roles}:{roles?:string[]}){
 const {user,loading}=useAuthStore()
 if(loading)return <main className="container">Verificando sesión…</main>
 if(!user)return <Navigate to="/login" replace/>
 if(roles&&!roles.includes(user.role))return <Navigate to="/unauthorized" replace/>
 return <Outlet/>
}
