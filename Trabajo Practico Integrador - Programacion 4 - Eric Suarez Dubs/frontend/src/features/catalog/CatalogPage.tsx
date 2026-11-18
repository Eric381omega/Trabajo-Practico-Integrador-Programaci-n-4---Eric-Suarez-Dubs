import {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {getCategorias,getProductos} from '../api'
import {useCartStore} from '../../store/cartStore'
import {Card,Button,Field,Message} from '../../shared/ui'
export function CatalogPage(){
 const [search,setSearch]=useState(''),[cat,setCat]=useState(''),[skip,setSkip]=useState(0)
 const cats=useQuery({queryKey:['categorias'],queryFn:getCategorias})
 const products=useQuery({queryKey:['productos',search,cat,skip],queryFn:()=>getProductos({search:search||undefined,categoria_id:cat?Number(cat):undefined,skip,limit:8})})
 const add=useCartStore(s=>s.add)
 return <main className="container"><h1>Menú</h1><div className="row"><Field placeholder="Buscar producto…" value={search} onChange={e=>{setSearch(e.target.value);setSkip(0)}}/><select className="field" value={cat} onChange={e=>{setCat(e.target.value);setSkip(0)}}><option value="">Todas las categorías</option>{cats.data?.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
 {products.isLoading?<Message>Cargando productos…</Message>:products.data?.items.length===0?<Message>No hay productos para mostrar.</Message>:<div className="grid">{products.data?.items.map(p=><Card key={p.id}><h3>{p.nombre}</h3><p>{p.descripcion}</p><p><b>${p.precio_base.toLocaleString('es-AR')}</b></p><p className="muted">Stock: {p.stock}</p><Button disabled={!p.disponible||p.stock<1} onClick={()=>add({producto_id:p.id,nombre:p.nombre,precio_unitario:p.precio_base,cantidad:1,imagen_url:p.imagen_url})}>Agregar al carrito</Button></Card>)}</div>}
 <div className="row"><Button disabled={skip===0} onClick={()=>setSkip(Math.max(0,skip-8))}>Anterior</Button><Button disabled={!products.data||skip+8>=products.data.total} onClick={()=>setSkip(skip+8)}>Siguiente</Button><span>{products.data?.total??0} productos</span></div></main>
}
