import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import OrderHome from './pages/order/OrderHome'
import Orders from './pages/order/Orders'
import CreateOrder from './pages/order/CreateOrder'
import Stock from './pages/Stock'
import User from './pages/User'
import Login from './pages/auth/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/category' element={<Category />} />
          <Route path='/product' element={<Product />} />
          <Route path='/order' element={<OrderHome />} />
          <Route path='/order/orders' element={<Orders />} />
          <Route path='/order/createorder' element={<CreateOrder />} />
          <Route path='/stock' element={<Stock />} />
          <Route path='/user' element={<User />} />
  
          </Route>
          <Route path='/auth/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
