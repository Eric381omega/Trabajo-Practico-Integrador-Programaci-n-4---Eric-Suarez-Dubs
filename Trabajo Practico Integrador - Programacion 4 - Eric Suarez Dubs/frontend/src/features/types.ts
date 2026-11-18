export interface Categoria {id:number;nombre:string;descripcion:string|null;activo:boolean}
export interface Producto {id:number;categoria_id:number;nombre:string;descripcion:string|null;precio_base:number;imagen_url:string;stock:number;disponible:boolean;activo:boolean;categoria?:Categoria|null}
export interface Page<T>{total:number;items:T[]}
export interface PedidoItem {producto_id:number;nombre_producto:string;precio_unitario:number;cantidad:number;subtotal:number}
export interface Pedido {id:number;usuario_id:number;estado:string;forma_pago:string;direccion_entrega:string;notas:string|null;total:number;created_at:string;updated_at:string;items:PedidoItem[]}
export interface Resumen {pendientes:number;en_preparacion:number;entregados:number;cancelados:number;pedidos_hoy:number;ingresos_entregados:number}
