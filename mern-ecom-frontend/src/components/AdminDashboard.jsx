// src/components/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../api/config'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/admin/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchStats()
  }, [navigate])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      // Fetch categories count
      const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`, config)
      setStats(prev => ({ ...prev, categories: categoriesResponse.data.categories.length }))

      // Fetch products count
      const productsResponse = await axios.get(`${API_BASE_URL}/products`, config)
      setStats(prev => ({ ...prev, products: productsResponse.data.products.length }))

      // Note: Orders stats would be implemented when orders endpoint is available
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="container-fluid">
      {/* Welcome Section */}
      <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '15px', backgroundColor: '#f8f9fa', color: '#495057'}}>
        <div className="card-body p-3 p-lg-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="mb-2 fw-bold h4 h-lg-2">
                <i className="fas fa-chart-line me-2"></i>
                Welcome back, {user?.name || 'Admin'}!
              </h2>
              <p className="mb-0 text-muted small">Here's what's happening with your store today.</p>
            </div>
            <div className="col-lg-4 text-end">
              <div className="d-flex align-items-center justify-content-end">
                <i className="fas fa-calendar-alt me-2"></i>
                <small className="d-none d-sm-inline">{new Date().toLocaleDateString()}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', backgroundColor: '#ffffff', color: '#495057'}}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-muted small mb-1">Categories</div>
                  <div className="h4 mb-0 fw-bold">{stats.categories}</div>
                </div>
                <div className="bg-light rounded-circle p-2 p-lg-3">
                  <i className="fas fa-tags fa-lg fa-2x text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', backgroundColor: '#ffffff', color: '#495057'}}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-muted small mb-1">Products</div>
                  <div className="h4 mb-0 fw-bold">{stats.products}</div>
                </div>
                <div className="bg-light rounded-circle p-2 p-lg-3">
                  <i className="fas fa-box fa-lg fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', backgroundColor: '#ffffff', color: '#495057'}}>
            <div className="card-body p-3">
              <div className="flex-grow-1">
                <div className="text-muted small mb-1">Orders</div>
                <div className="h4 mb-0 fw-bold">{stats.orders}</div>
              </div>
              <div className="bg-light rounded-circle p-2 p-lg-3">
                <i className="fas fa-shopping-cart fa-lg fa-2x text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', backgroundColor: '#ffffff', color: '#495057'}}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-muted small mb-1">Revenue</div>
                  <div className="h4 mb-0 fw-bold">$0.00</div>
                </div>
                <div className="bg-light rounded-circle p-2 p-lg-3">
                  <i className="fas fa-dollar-sign fa-lg fa-2x text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
        <div className="card-header bg-white border-0 py-3 py-lg-4">
          <h5 className="mb-0 fw-bold text-dark h6 h-lg-5">
            <i className="fas fa-bolt me-2 text-warning"></i>
            Quick Actions
          </h5>
        </div>
        <div className="card-body p-3 p-lg-4">
          <div className="row g-2 g-lg-3">
            <div className="col-6 col-lg-3">
              <Link to="/admin/categories" className="btn btn-primary w-100 h-100 d-flex flex-column justify-content-center align-items-center p-2 p-lg-4 text-white fw-semibold" style={{borderRadius: '12px', backgroundColor: '#007bff', border: 'none', transition: 'transform 0.2s', minHeight: '80px'}}>
                <i className="fas fa-plus-circle fa-lg fa-2x mb-1 mb-lg-2"></i>
                <span className="small">Add Category</span>
              </Link>
            </div>
            <div className="col-6 col-lg-3">
              <Link to="/admin/products" className="btn btn-secondary w-100 h-100 d-flex flex-column justify-content-center align-items-center p-2 p-lg-4 text-white fw-semibold" style={{borderRadius: '12px', backgroundColor: '#6c757d', border: 'none', minHeight: '80px'}}>
                <i className="fas fa-plus fa-lg fa-2x mb-1 mb-lg-2"></i>
                <span className="small">Add Product</span>
              </Link>
            </div>
            <div className="col-6 col-lg-3">
              <button className="btn btn-info w-100 h-100 d-flex flex-column justify-content-center align-items-center p-2 p-lg-4 text-white fw-semibold" disabled style={{borderRadius: '12px', backgroundColor: '#17a2b8', border: 'none', minHeight: '80px'}}>
                <i className="fas fa-eye fa-lg fa-2x mb-1 mb-lg-2"></i>
                <span className="small">View Reports</span>
                <small className="text-white-50 mt-1 d-none d-lg-block">Coming Soon</small>
              </button>
            </div>
            <div className="col-6 col-lg-3">
              <button className="btn btn-success w-100 h-100 d-flex flex-column justify-content-center align-items-center p-2 p-lg-4 text-white fw-semibold" disabled style={{borderRadius: '12px', backgroundColor: '#28a745', border: 'none', minHeight: '80px'}}>
                <i className="fas fa-cog fa-lg fa-2x mb-1 mb-lg-2"></i>
                <span className="small">Settings</span>
                <small className="text-white-50 mt-1 d-none d-lg-block">Coming Soon</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard