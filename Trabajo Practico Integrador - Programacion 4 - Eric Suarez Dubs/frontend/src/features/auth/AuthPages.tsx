import {useState} from 'react'
import {useForm} from '@tanstack/react-form'
import {Link,useNavigate} from 'react-router-dom'
import {useAuthStore} from '../../store/authStore'
import {api,apiError} from '../../shared/api/axiosInstance'
import {Card,Button,ErrorText} from '../../shared/ui'

export function LoginPage(){
 const login=useAuthStore(s=>s.login),nav=useNavigate(),[error,setError]=useState('')
 const form=useForm({defaultValues:{username:'',password:''},onSubmit:async({value})=>{
   try{await login(value.username,value.password);nav('/')}catch(x){setError(apiError(x))}
 }})
 return <div className="container"><Card><h1>Iniciar sesión</h1>
 <form onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit()}}>
  <form.Field name="username">{field=><label>Usuario<input className="field" value={field.state.value} onChange={e=>field.handleChange(e.target.value)} required/></label>}</form.Field>
  <form.Field name="password">{field=><label>Contraseña<input className="field" type="password" value={field.state.value} onChange={e=>field.handleChange(e.target.value)} required/></label>}</form.Field>
  {error&&<ErrorText>{error}</ErrorText>}<Button type="submit">Ingresar</Button>
 </form><p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p></Card></div>
}
export function RegisterPage(){
 const [error,setError]=useState(''),nav=useNavigate()
 const form=useForm({defaultValues:{username:'',full_name:'',email:'',password:''},onSubmit:async({value})=>{
   try{await api.post('/auth/register',value);nav('/login')}catch(x){setError(apiError(x))}
 }})
 return <div className="container"><Card><h1>Crear cuenta</h1>
 <form onSubmit={e=>{e.preventDefault();e.stopPropagation();void form.handleSubmit()}}>
  <form.Field name="username">{f=><label>Usuario<input className="field" value={f.state.value} onChange={e=>f.handleChange(e.target.value)} minLength={3} required/></label>}</form.Field>
  <form.Field name="full_name">{f=><label>Nombre completo<input className="field" value={f.state.value} onChange={e=>f.handleChange(e.target.value)} required/></label>}</form.Field>
  <form.Field name="email">{f=><label>Email<input className="field" type="email" value={f.state.value} onChange={e=>f.handleChange(e.target.value)} required/></label>}</form.Field>
  <form.Field name="password">{f=><label>Contraseña<input className="field" type="password" value={f.state.value} onChange={e=>f.handleChange(e.target.value)} minLength={8} required/></label>}</form.Field>
  {error&&<ErrorText>{error}</ErrorText>}<Button type="submit">Registrarme</Button>
 </form></Card></div>
}
export function UnauthorizedPage(){return <div className="container"><Card><h1>Sin permisos</h1><Link to="/">Volver al inicio</Link></Card></div>}
