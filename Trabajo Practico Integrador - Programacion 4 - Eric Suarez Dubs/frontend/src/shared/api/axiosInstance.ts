import axios from 'axios'
export const api = axios.create({baseURL:import.meta.env.VITE_API_URL,withCredentials:true})
api.interceptors.response.use(r=>r,err=>{
  if(err.response?.status===401 && !String(err.config?.url).includes('/auth/token') && !String(err.config?.url).includes('/auth/me')){
    window.dispatchEvent(new Event('foodstore:unauthorized'))
  }
  if(err.response?.status===400 && err.response?.data?.detail==='Cuenta de usuario desactivada'){
    window.dispatchEvent(new Event('foodstore:unauthorized'))
  }
  return Promise.reject(err)
})
export function apiError(error:unknown):string{
  if(typeof error==='object' && error!==null && 'response' in error){
    const detail=(error as {response?:{data?:{detail?:unknown}}}).response?.data?.detail
    if(typeof detail==='string') return detail
  }
  return 'Ocurrió un error. Intente nuevamente.'
}
