import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {api} from '../shared/api/axiosInstance'
export interface User {id:number;username:string;full_name:string;email:string;role:'user'|'admin';disabled:boolean}
interface AuthState {user:User|null;loading:boolean;setUser:(u:User|null)=>void;checkSession:()=>Promise<void>;login:(username:string,password:string)=>Promise<void>;logout:()=>Promise<void>}
export const useAuthStore=create<AuthState>()(persist((set)=>({
 user:null,loading:true,setUser:(user)=>set({user}),
 checkSession:async()=>{try{const r=await api.get<User>('/auth/me');set({user:r.data})}catch{set({user:null})}finally{set({loading:false})}},
 login:async(username,password)=>{const body=new URLSearchParams({username,password});await api.post('/auth/token',body,{headers:{'Content-Type':'application/x-www-form-urlencoded'}});const r=await api.get<User>('/auth/me');set({user:r.data})},
 logout:async()=>{try{await api.post('/auth/logout')}finally{set({user:null})}}
}),{name:'foodstore-auth',partialize:(s)=>({user:s.user})}))
