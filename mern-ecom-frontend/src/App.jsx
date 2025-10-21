import { Routes, Route } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import AdminLayout from './components/AdminLayout'
import CategoryManagement from './components/CategoryManagement'
import ProductManagement from './components/ProductManagement'
import BannerManagement from './components/BannerManagement'
import OrdersManagement from './components/OrdersManagement'
import UsersManagement from './components/UsersManagement'
import Settings from './components/Settings'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/" element={<div>Welcome to E-commerce Admin Panel</div>} />
      </Routes>
    </div>
  )
}

export default App
