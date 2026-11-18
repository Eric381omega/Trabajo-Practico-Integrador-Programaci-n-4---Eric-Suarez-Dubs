import {useState} from 'react'
import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom'
import {apiError} from '../../shared/api/axiosInstance'
import {useCartStore} from '../../store/cartStore'
import {getPedidos,createPedido,cancelPedido,changePedido,getResumen} from '../api'
import {Card,Button,Field,ErrorText,Message} from '../../shared/ui'
export function CartPage(){
 const {items,remove,setQty,total}=useCartStore()
 return <main className="container"><h1>Carrito</h1><Card>{items.length===0?<Message>El carrito está vacío.</Message>:items.map(i=><div className="row" key={i.producto_id}><b>{i.nombre}</b><span>${i.precio_unitario}</span><input aria-label="Cantidad" type="number" min="1" value={i.cantidad} onChange={e=>setQty(i.producto_id,Number(e.target.value))}/><Button onClick={()=>remove(i.producto_id)}>Quitar</Button></div>)}<h2>Total: ${total().toLocaleString('es-AR')}</h2></Card></main>
}
export function CheckoutPage(){
 const {items,total,clear}=useCartStore(),nav=useNavigate(),[direccion,setDireccion]=useState(''),[pago,setPago]=useState('EFECTIVO'),[notas,setNotas]=useState(''),[error,setError]=useState('')
 const mutation=useMutation({mutationFn:()=>createPedido({items:items.map(i=>({producto_id:i.producto_id,cantidad:i.cantidad})),direccion_entrega:direccion,forma_pago:pago,notas}),onSuccess:()=>{clear();nav('/mis-pedidos')},onError:e=>setError(apiError(e))})
 return <main className="container"><Card><h1>Confirmar pedido</h1><form onSubmit={e=>{e.preventDefault();mutation.mutate()}}><label>Dirección de entrega<Field value={direccion} onChange={e=>setDireccion(e.target.value)} minLength={5} maxLength={200} required/></label><label>Forma de pago<select className="field" value={pago} onChange={e=>setPago(e.target.value)}><option>EFECTIVO</option><option>TRANSFERENCIA</option></select></label><label>Notas<Field value={notas} onChange={e=>setNotas(e.target.value)}/></label><h3>Total: ${total().toLocaleString('es-AR')}</h3>{error&&<ErrorText>{error}</ErrorText>}<Button type="submit" disabled={!items.length||mutation.isPending}>Confirmar compra</Button></form></Card></main>
}
export function MyOrdersPage(){
 const q=useQuery({queryKey:['pedidos'],queryFn:getPedidos}),qc=useQueryClient(),cancel=useMutation({mutationFn:cancelPedido,onSuccess:()=>qc.invalidateQueries({queryKey:['pedidos']})})
 return <main className="container"><h1>Mis pedidos</h1>{q.isLoading?<Message>Cargando…</Message>:q.data?.items.map(p=><Card key={p.id}><div className="row"><h3>Pedido #{p.id}</h3><b>{p.estado}</b></div><p>Total: ${p.total}</p><ul>{p.items.map((i,n)=><li key={n}>{i.nombre_producto} × {i.cantidad}</li>)}</ul>{p.estado==='PENDIENTE'&&<Button onClick={()=>cancel.mutate(p.id)}>Cancelar pedido</Button>}</Card>)}</main>
}
export function AdminOrdersPage(){
 const q=useQuery({queryKey:['pedidos'],queryFn:getPedidos}),qc=useQueryClient(),m=useMutation({mutationFn:({id,estado}:{id:number;estado:string})=>changePedido(id,estado),onSuccess:()=>qc.invalidateQueries({queryKey:['pedidos']})})
 return <main className="container"><h1>Gestión de pedidos</h1>{q.data?.items.map(p=><Card key={p.id}><h3>Pedido #{p.id} — {p.estado}</h3><p>Usuario #{p.usuario_id} · ${p.total}</p><div className="row">{p.estado==='PENDIENTE'&&<Button onClick={()=>m.mutate({id:p.id,estado:'EN_PREPARACION'})}>Preparar</Button>}{p.estado==='EN_PREPARACION'&&<Button onClick={()=>m.mutate({id:p.id,estado:'ENTREGADO'})}>Entregado</Button>}{['PENDIENTE','EN_PREPARACION'].includes(p.estado)&&<Button onClick={()=>m.mutate({id:p.id,estado:'CANCELADO'})}>Cancelar</Button>}</div></Card>)}</main>
}
export function AdminSummaryPage(){
 const q=useQuery({queryKey:['resumen'],queryFn:getResumen})
 return <main className="container"><h1>Resumen del negocio</h1><div className="grid">{q.data&&Object.entries(q.data).map(([k,v])=><Card key={k}><p className="muted">{k.replaceAll('_',' ')}</p><h2>{typeof v==='number'&&k==='ingresos_entregados'?`$${v.toLocaleString('es-AR')}`:v}</h2></Card>)}</div></main>
}
