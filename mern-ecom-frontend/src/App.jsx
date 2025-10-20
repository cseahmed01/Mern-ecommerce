import { Routes, Route } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import CategoryManagement from './components/CategoryManagement'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />
        <Route path="/" element={<div>Welcome to E-commerce Admin Panel</div>} />
      </Routes>
    </div>
  )
}

export default App
