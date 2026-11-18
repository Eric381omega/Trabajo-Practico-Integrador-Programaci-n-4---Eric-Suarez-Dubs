import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {ProtectedRoute} from './ProtectedRoute'
import {Navbar} from '../shared/layout/Navbar'
import {LoginPage,RegisterPage,UnauthorizedPage} from '../features/auth/AuthPages'
import {CatalogPage} from '../features/catalog/CatalogPage'
import {CartPage,CheckoutPage,MyOrdersPage,AdminOrdersPage,AdminSummaryPage} from '../features/orders/OrderPages'
import {AdminCategoriesPage,AdminProductsPage,AdminUsersPage} from '../features/admin/AdminPages'
export function AppRouter(){return <BrowserRouter><Navbar/><Routes>
<Route path="/" element={<CatalogPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/unauthorized" element={<UnauthorizedPage/>}/>
<Route element={<ProtectedRoute/>}><Route path="/carrito" element={<CartPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/><Route path="/mis-pedidos" element={<MyOrdersPage/>}/></Route>
<Route element={<ProtectedRoute roles={['admin']}/>}>
<Route path="/admin/resumen" element={<AdminSummaryPage/>}/><Route path="/admin/categorias" element={<AdminCategoriesPage/>}/><Route path="/admin/productos" element={<AdminProductsPage/>}/><Route path="/admin/pedidos" element={<AdminOrdersPage/>}/><Route path="/admin/usuarios" element={<AdminUsersPage/>}/>
</Route></Routes></BrowserRouter>}
