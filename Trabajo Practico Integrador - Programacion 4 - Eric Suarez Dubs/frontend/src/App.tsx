import {useEffect} from 'react'
import {AppRouter} from './routes/AppRouter'
import {useAuthStore} from './store/authStore'
export default function App(){const check=useAuthStore(s=>s.checkSession),setUser=useAuthStore(s=>s.setUser);useEffect(()=>{void check();const handler=()=>setUser(null);window.addEventListener('foodstore:unauthorized',handler);return()=>window.removeEventListener('foodstore:unauthorized',handler)},[check,setUser]);return <AppRouter/>}
