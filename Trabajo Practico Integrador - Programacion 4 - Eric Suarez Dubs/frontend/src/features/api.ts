import {api} from '../shared/api/axiosInstance'
import type {Categoria,Producto,Page,Pedido,Resumen} from './types'
export const getCategorias=async()=> (await api.get<Categoria[]>('/categorias')).data
export const getProductos=async(params:Record<string,string|number|boolean|undefined>)=>(await api.get<Page<Producto>>('/productos',{params})).data
export const saveCategoria=async(data:Partial<Categoria>)=>data.id?(await api.put<Categoria>(`/categorias/${data.id}`,data)).data:(await api.post<Categoria>('/categorias',data)).data
export const deleteCategoria=async(id:number)=>api.delete(`/categorias/${id}`)
export const saveProducto=async(data:Partial<Producto>)=>data.id?(await api.put<Producto>(`/productos/${data.id}`,data)).data:(await api.post<Producto>('/productos',data)).data
export const updateStock=async(id:number,stock:number,disponible:boolean)=>(await api.patch<Producto>(`/productos/${id}/stock`,{stock,disponible})).data
export const deleteProducto=async(id:number)=>api.delete(`/productos/${id}`)
export const getPedidos=async()=> (await api.get<{total:number;items:Pedido[]}>('/pedidos',{params:{limit:100}})).data
export const createPedido=async(data:unknown)=>(await api.post<Pedido>('/pedidos',data)).data
export const cancelPedido=async(id:number)=>(await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data
export const changePedido=async(id:number,estado:string)=>(await api.patch<Pedido>(`/pedidos/${id}/estado`,{estado})).data
export const getResumen=async()=> (await api.get<Resumen>('/pedidos/resumen')).data
export const getUsuarios=async()=> (await api.get('/admin/usuarios')).data as Array<{id:number;username:string;full_name:string;email:string;role:string;disabled:boolean}>
export const userAction=async(id:number,action:'activar'|'desactivar')=>(await api.post(`/admin/usuarios/${id}/${action}`)).data
