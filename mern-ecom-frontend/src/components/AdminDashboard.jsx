import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992)
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
      const categoriesResponse = await axios.get('http://localhost:5001/api/categories', config)
      setStats(prev => ({ ...prev, categories: categoriesResponse.data.categories.length }))

      // Note: Products and orders stats would be implemented when those endpoints are available
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container-fluid">
          <button
            className="btn btn-outline-light me-3 border-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{borderRadius: '8px'}}
          >
            <i className="fas fa-bars"></i>
          </button>
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/admin/dashboard">
            <i className="fas fa-tachometer-alt me-2"></i>
            <span className="d-none d-sm-inline">Admin Dashboard</span>
            <span className="d-sm-none">Dashboard</span>
          </Link>
          <div className="d-flex ms-auto align-items-center">
            <div className="dropdown">
              <button
                className="btn btn-outline-light border-0 d-flex align-items-center"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{borderRadius: '25px'}}
              >
                <i className="fas fa-user-circle me-2"></i>
                <span className="d-none d-md-inline">{user?.name || 'Admin'}</span>
                <i className="fas fa-chevron-down ms-2"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#"><i className="fas fa-user me-2"></i>Profile</a></li>
                <li><a className="dropdown-item" href="#"><i className="fas fa-cog me-2"></i>Settings</a></li>
                <li><hr className="dropdown-divider"/></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className={`bg-white shadow-sm ${isSidebarOpen ? 'd-block position-fixed position-lg-relative' : 'd-none d-lg-block position-lg-relative'}`} style={{width: '280px', minHeight: 'calc(100vh - 76px)', zIndex: 1030, top: isSidebarOpen ? '76px' : 'auto', left: isSidebarOpen ? 0 : 'auto'}}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-primary">
              <i className="fas fa-bars me-2"></i>
              Navigation
            </h6>
            <button
              className="btn btn-sm btn-outline-secondary border-0 d-lg-none"
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="nav nav-pills flex-column p-2">
            <Link
              to="/admin/dashboard"
              className="nav-link d-flex align-items-center py-3 px-3 mb-1 rounded"
              style={{backgroundColor: '#f8f9fa', color: '#495057', border: 'none'}}
              onClick={() => window.innerWidth < 992 && setIsSidebarOpen(false)}
            >
              <i className="fas fa-home me-3"></i>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/categories"
              className="nav-link d-flex align-items-center py-3 px-3 mb-1 rounded text-dark"
              onClick={() => window.innerWidth < 992 && setIsSidebarOpen(false)}
            >
              <i className="fas fa-tags me-3"></i>
              <span>Categories</span>
            </Link>
            <a
              href="#"
              className="nav-link d-flex align-items-center py-3 px-3 mb-1 rounded text-muted"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-box me-3"></i>
              <span>Products</span>
              <small className="ms-auto badge bg-secondary">Soon</small>
            </a>
            <a
              href="#"
              className="nav-link d-flex align-items-center py-3 px-3 mb-1 rounded text-muted"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-shopping-cart me-3"></i>
              <span>Orders</span>
              <small className="ms-auto badge bg-secondary">Soon</small>
            </a>
            <hr className="my-3"/>
            <button
              className="nav-link d-flex align-items-center py-3 px-3 mb-1 rounded text-danger border-0 bg-transparent"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-3"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="d-lg-none position-fixed"
            style={{top: '76px', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1029}}
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className={`flex-grow-1 p-3 p-lg-4`} style={{marginLeft: isSidebarOpen && window.innerWidth >= 992 ? '280px' : '0', marginTop: '0', transition: 'margin-left 0.3s ease'}}>
          {/* Welcome Section */}
          <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
            <div className="card-body p-3 p-lg-4">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h2 className="mb-2 fw-bold h4 h-lg-2">
                    <i className="fas fa-chart-line me-2"></i>
                    Welcome back, {user?.name || 'Admin'}!
                  </h2>
                  <p className="mb-0 opacity-75 small">Here's what's happening with your store today.</p>
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
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-white-50 small mb-1">Categories</div>
                      <div className="h4 mb-0 fw-bold">{stats.categories}</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 p-lg-3">
                      <i className="fas fa-tags fa-lg fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white'}}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-white-50 small mb-1">Products</div>
                      <div className="h4 mb-0 fw-bold">{stats.products}</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 p-lg-3">
                      <i className="fas fa-box fa-lg fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white'}}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-white-50 small mb-1">Orders</div>
                      <div className="h4 mb-0 fw-bold">{stats.orders}</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 p-lg-3">
                      <i className="fas fa-shopping-cart fa-lg fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white'}}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-white-50 small mb-1">Revenue</div>
                      <div className="h4 mb-0 fw-bold">$0.00</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 p-lg-3">
                      <i className="fas fa-dollar-sign fa-lg fa-2x text-white"></i>
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
                  <Link to="/admin/categories" className="btn btn-primary w-100 h-100 d-flex flex-column align-items-center p-2 p-lg-4 text-white fw-semibold" style={{borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', transition: 'transform 0.2s', minHeight: '80px'}}>
                    <i className="fas fa-plus-circle fa-lg fa-2x mb-1 mb-lg-2"></i>
                    <span className="small">Add Category</span>
                  </Link>
                </div>
                <div className="col-6 col-lg-3">
                  <button className="btn btn-secondary w-100 h-100 d-flex flex-column align-items-center p-2 p-lg-4 text-white fw-semibold" disabled style={{borderRadius: '12px', background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', border: 'none', minHeight: '80px'}}>
                    <i className="fas fa-plus fa-lg fa-2x mb-1 mb-lg-2"></i>
                    <span className="small">Add Product</span>
                    <small className="text-white-50 mt-1 d-none d-lg-block">Coming Soon</small>
                  </button>
                </div>
                <div className="col-6 col-lg-3">
                  <button className="btn btn-info w-100 h-100 d-flex flex-column align-items-center p-2 p-lg-4 text-white fw-semibold" disabled style={{borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', border: 'none', minHeight: '80px'}}>
                    <i className="fas fa-eye fa-lg fa-2x mb-1 mb-lg-2"></i>
                    <span className="small">View Reports</span>
                    <small className="text-white-50 mt-1 d-none d-lg-block">Coming Soon</small>
                  </button>
                </div>
                <div className="col-6 col-lg-3">
                  <button className="btn btn-success w-100 h-100 d-flex flex-column align-items-center p-2 p-lg-4 text-white fw-semibold" disabled style={{borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', minHeight: '80px'}}>
                    <i className="fas fa-cog fa-lg fa-2x mb-1 mb-lg-2"></i>
                    <span className="small">Settings</span>
                    <small className="text-white-50 mt-1 d-none d-lg-block">Coming Soon</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard