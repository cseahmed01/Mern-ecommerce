import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <i className="fas fa-shopping-bag fa-lg me-2 text-primary"></i>
          <span className="d-none d-sm-inline">MERN Shop</span>
        </Link>

        {/* Mobile menu toggle */}
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
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-box me-1"></i>Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-tags me-1"></i>Categories
              </Link>
            </li>
          </ul>

          {/* Right-side menu */}
          <ul className="navbar-nav ms-auto d-flex align-items-lg-center flex-column flex-lg-row gap-lg-3">
            {/* Cart */}
            <li className="nav-item mb-2 mb-lg-0 position-relative">
              <Link className="nav-link" to="/cart" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-shopping-cart fa-lg"></i>
                <span className="d-lg-none ms-2">Cart</span>
                {cart.items.length > 0 && (
                  <span className="badge bg-primary position-absolute top-0 start-100 translate-middle">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </li>

            {/* User Section */}
            {user ? (
              <li className="nav-item dropdown mb-2 mb-lg-0" ref={dropdownRef}>
                <button
                  className="btn btn-link nav-link d-flex align-items-center hover-effect p-0 border-0 bg-transparent text-decoration-none"
                  type="button"
                  onClick={toggleUserDropdown}
                >
                  <i className="fas fa-user-circle fa-lg me-2"></i>
                  <span className="d-none d-lg-inline">{user.name}</span>
                  <i className={`fas ms-2 ${isUserDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                {isUserDropdownOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show position-absolute">
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setIsUserDropdownOpen(false)}>
                        <i className="fas fa-user me-2"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders" onClick={() => setIsUserDropdownOpen(false)}>
                        <i className="fas fa-shopping-bag me-2"></i>Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/wishlist" onClick={() => setIsUserDropdownOpen(false)}>
                        <i className="fas fa-heart me-2"></i>Wishlist
                      </Link>
                    </li>
                    {user.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item" to="/admin" onClick={() => setIsUserDropdownOpen(false)}>
                          <i className="fas fa-cog me-2"></i>Admin Panel
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item mb-2 mb-lg-0">
                  <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-sign-in-alt me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item mb-2 mb-lg-0">
                  <Link className="nav-link" to="/register" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user-plus me-1"></i>Register
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
