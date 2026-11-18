import {useState} from 'react'
import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query'
import {useReactTable,getCoreRowModel,flexRender,type ColumnDef} from '@tanstack/react-table'
import {getCategorias,saveCategoria,deleteCategoria,getProductos,saveProducto,deleteProducto,updateStock,getUsuarios,userAction} from '../api'
import {Card,Button,Field} from '../../shared/ui'
import type {Categoria,Producto} from '../types'

function DataTable<T>({data,columns}:{data:T[];columns:ColumnDef<T,unknown>[]}){
 const table=useReactTable({data,columns,getCoreRowModel:getCoreRowModel()})
 return <div style={{overflowX:'auto'}}><table style={{width:'100%',textAlign:'left',borderCollapse:'collapse'}}>
 <thead>{table.getHeaderGroups().map(g=><tr key={g.id}>{g.headers.map(h=><th style={{padding:10,borderBottom:'1px solid #ddd'}} key={h.id}>{h.isPlaceholder?null:flexRender(h.column.columnDef.header,h.getContext())}</th>)}</tr>)}</thead>
 <tbody>{table.getRowModel().rows.map(r=><tr key={r.id}>{r.getVisibleCells().map(c=><td style={{padding:10,borderBottom:'1px solid #eee'}} key={c.id}>{flexRender(c.column.columnDef.cell,c.getContext())}</td>)}</tr>)}</tbody>
 </table></div>
}
export function AdminCategoriesPage(){
 const q=useQuery({queryKey:['categorias'],queryFn:getCategorias}),qc=useQueryClient(),[nombre,setNombre]=useState(''),[descripcion,setDesc]=useState('')
 const save=useMutation({mutationFn:()=>saveCategoria({nombre,descripcion}),onSuccess:()=>{setNombre('');setDesc('');qc.invalidateQueries({queryKey:['categorias']})}})
 const del=useMutation({mutationFn:deleteCategoria,onSuccess:()=>qc.invalidateQueries({queryKey:['categorias']})})
 const columns:ColumnDef<Categoria,unknown>[]=[
  {accessorKey:'nombre',header:'Nombre'},{accessorKey:'descripcion',header:'Descripción'},
  {id:'acciones',header:'Acciones',cell:({row})=><Button onClick={()=>del.mutate(row.original.id)}>Dar de baja</Button>}
 ]
 return <main className="container"><h1>Administrar categorías</h1><Card><form onSubmit={e=>{e.preventDefault();save.mutate()}}><Field placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} required minLength={2}/><Field placeholder="Descripción" value={descripcion} onChange={e=>setDesc(e.target.value)}/><Button type="submit">Crear categoría</Button></form></Card><Card>{q.data&&<DataTable data={q.data} columns={columns}/>}</Card></main>
}
export function AdminProductsPage(){
 const cats=useQuery({queryKey:['categorias'],queryFn:getCategorias}),q=useQuery({queryKey:['productos','admin'],queryFn:()=>getProductos({limit:100})}),qc=useQueryClient()
 const [form,setForm]=useState({categoria_id:0,nombre:'',descripcion:'',precio_base:0,imagen_url:'',stock:0,disponible:true})
 const save=useMutation({mutationFn:()=>saveProducto({...form,categoria_id:Number(form.categoria_id),precio_base:Number(form.precio_base),stock:Number(form.stock)}),onSuccess:()=>{qc.invalidateQueries({queryKey:['productos']});setForm({categoria_id:0,nombre:'',descripcion:'',precio_base:0,imagen_url:'',stock:0,disponible:true})}})
 const stock=useMutation({mutationFn:({id,s}:{id:number;s:number})=>updateStock(id,s,true),onSuccess:()=>qc.invalidateQueries({queryKey:['productos']})})
 const del=useMutation({mutationFn:deleteProducto,onSuccess:()=>qc.invalidateQueries({queryKey:['productos']})})
 const columns:ColumnDef<Producto,unknown>[]=[
  {accessorKey:'nombre',header:'Producto'},{accessorKey:'precio_base',header:'Precio'},
  {accessorKey:'stock',header:'Stock'},
  {id:'acciones',header:'Acciones',cell:({row})=><div className="row"><Button onClick={()=>stock.mutate({id:row.original.id,s:row.original.stock+1})}>+1 stock</Button><Button onClick={()=>del.mutate(row.original.id)}>Dar de baja</Button></div>}
 ]
 return <main className="container"><h1>Administrar productos</h1><Card><form onSubmit={e=>{e.preventDefault();save.mutate()}}>
 <Field placeholder="Nombre" value={form.nombre} onChange={e=>setForm(s=>({...s,nombre:e.target.value}))} required/>
 <Field placeholder="Descripción" value={form.descripcion} onChange={e=>setForm(s=>({...s,descripcion:e.target.value}))}/>
 <label>Categoría<select className="field" value={form.categoria_id} onChange={e=>setForm(s=>({...s,categoria_id:Number(e.target.value)}))} required><option value="0">Seleccionar</option>{cats.data?.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></label>
 <Field type="number" min="0" step="0.01" placeholder="Precio" value={form.precio_base} onChange={e=>setForm(s=>({...s,precio_base:Number(e.target.value)}))}/>
 <Field type="number" min="0" placeholder="Stock" value={form.stock} onChange={e=>setForm(s=>({...s,stock:Number(e.target.value)}))}/>
 <Field placeholder="URL de imagen" value={form.imagen_url} onChange={e=>setForm(s=>({...s,imagen_url:e.target.value}))}/>
 <Button type="submit">Crear producto</Button></form></Card><Card>{q.data&&<DataTable data={q.data.items} columns={columns}/>}</Card></main>
}
export function AdminUsersPage(){
 const q=useQuery({queryKey:['usuarios'],queryFn:getUsuarios}),qc=useQueryClient(),m=useMutation({mutationFn:({id,a}:{id:number;a:'activar'|'desactivar'})=>userAction(id,a),onSuccess:()=>qc.invalidateQueries({queryKey:['usuarios']})})
 type UserRow=NonNullable<typeof q.data>[number]
 const columns:ColumnDef<UserRow,unknown>[]=[
  {accessorKey:'username',header:'Usuario'},{accessorKey:'full_name',header:'Nombre'},
  {accessorKey:'email',header:'Email'},{accessorKey:'role',header:'Rol'},
  {accessorKey:'disabled',header:'Estado',cell:({row})=>row.original.disabled?'Desactivado':'Activo'},
  {id:'acciones',header:'Acciones',cell:({row})=>row.original.role==='admin'?null:<Button onClick={()=>m.mutate({id:row.original.id,a:row.original.disabled?'activar':'desactivar'})}>{row.original.disabled?'Activar':'Desactivar'}</Button>}
 ]
 return <main className="container"><h1>Administrar usuarios</h1><Card>{q.data&&<DataTable data={q.data} columns={columns}/>}</Card></main>
}
