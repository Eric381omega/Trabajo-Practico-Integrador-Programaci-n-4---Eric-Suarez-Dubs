import {create} from 'zustand'
import {persist} from 'zustand/middleware'
export interface CartItem {producto_id:number;nombre:string;precio_unitario:number;cantidad:number;imagen_url:string}
interface CartState {items:CartItem[];add:(p:CartItem)=>void;remove:(id:number)=>void;setQty:(id:number,q:number)=>void;clear:()=>void;total:()=>number}
export const useCartStore=create<CartState>()(persist((set,get)=>({
 items:[],
 add:(p)=>set(s=>{const found=s.items.find(i=>i.producto_id===p.producto_id);return {items:found?s.items.map(i=>i.producto_id===p.producto_id?{...i,cantidad:i.cantidad+p.cantidad}:i):[...s.items,p]}}),
 remove:(id)=>set(s=>({items:s.items.filter(i=>i.producto_id!==id)})),
 setQty:(id,q)=>set(s=>({items:s.items.map(i=>i.producto_id===id?{...i,cantidad:Math.max(1,q)}:i)})),
 clear:()=>set({items:[]}),total:()=>get().items.reduce((a,i)=>a+i.precio_unitario*i.cantidad,0)
}),{name:'foodstore-cart'}))
