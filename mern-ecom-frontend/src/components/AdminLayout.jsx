// src/components/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className={`bg-dark text-white ${sidebarOpen ? 'd-block' : 'd-none d-lg-block'} position-fixed h-100`}
           style={{ width: '250px', zIndex: 1000 }}>
        <div className="p-3 position-relative">
          <button className="btn btn-light position-absolute top-0 end-0 m-2 d-lg-none" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
          <h5 className="text-center mb-4">Admin Panel</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/admin/dashboard" className="nav-link text-white">
                <i className="fas fa-tachometer-alt me-2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/categories" className="nav-link text-white">
                <i className="fas fa-tags me-2"></i> Categories
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/products" className="nav-link text-white">
                <i className="fas fa-box me-2"></i> Products
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/banners" className="nav-link text-white">
                <i className="fas fa-images me-2"></i> Banners
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/orders" className="nav-link text-white">
                <i className="fas fa-shopping-cart me-2"></i> Orders
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/users" className="nav-link text-white">
                <i className="fas fa-users me-2"></i> Users
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/settings" className="nav-link text-white">
                <i className="fas fa-cog me-2"></i> Settings
              </Link>
            </li>
          </ul>
        </div>
        <div className="position-absolute bottom-0 w-100 p-3">
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: windowWidth >= 992 ? '250px' : '0' }}>
        {/* Header */}
        <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-secondary d-lg-none me-3" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <h4 className="mb-0 d-none d-sm-block">E-commerce Admin</h4>
          <h6 className="mb-0 d-sm-none">Admin</h6>
          <div className="d-flex align-items-center">
            <span className="me-3 d-none d-md-inline">Welcome, Admin</span>
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="fas fa-user"></i>
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-2 p-md-3 p-lg-4">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
             style={{ zIndex: 999 }}
             onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default AdminLayout;