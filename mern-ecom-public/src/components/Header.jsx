import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <i className="fas fa-shopping-bag fa-lg me-2 text-primary"></i>
          <span className="d-none d-sm-inline">MERN Shop</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          {/* Left-side menu */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link hover-effect d-flex align-items-center" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home me-1"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover-effect d-flex align-items-center" to="/products" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-box me-1"></i>
                <span>Products</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover-effect d-flex align-items-center" to="/categories" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-tags me-1"></i>
                <span>Categories</span>
              </Link>
            </li>
          </ul>

          {/* Right-side menu */}
          <ul className="navbar-nav ms-auto d-flex align-items-lg-center flex-column flex-lg-row gap-lg-3">
            {/* Cart */}
            <li className="nav-item mb-2 mb-lg-0 position-relative">
              <Link className="nav-link hover-effect" to="/cart" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-shopping-cart fa-lg"></i>
                <span className="d-lg-none ms-2">Cart</span>
                {cart.items.length > 0 && (
                  <span className="badge bg-primary position-absolute top-0 start-100 translate-middle">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </li>

            {/* User login/logout */}
            {user ? (
              <li className="nav-item dropdown mb-2 mb-lg-0">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center hover-effect"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-user-circle fa-lg me-2"></i>
                  <span className="d-none d-lg-inline">{user.name}</span>
                  <i className="fas fa-chevron-down ms-1 d-lg-none"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-user me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-shopping-bag me-2"></i>Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-heart me-2"></i>Wishlist
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item" to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <i className="fas fa-cog me-2"></i>Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item mb-2 mb-lg-0">
                  <Link className="nav-link hover-effect" to="/login" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-sign-in-alt me-1"></i>
                    <span className="d-none d-lg-inline">Login</span>
                  </Link>
                </li>
                <li className="nav-item mb-2 mb-lg-0">
                  <Link className="nav-link hover-effect" to="/register" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user-plus me-1"></i>
                    <span className="d-none d-lg-inline">Register</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
