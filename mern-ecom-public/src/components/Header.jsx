import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          MERN Shop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">Categories</Link>
            </li>
          </ul>

          <ul className="navbar-nav d-flex align-items-center">
            <li className="nav-item me-3">
              <Link className="nav-link position-relative" to="/cart">
                <i className="fas fa-shopping-cart fa-lg"></i>
                <span className="d-lg-none ms-2">Cart</span>
                {cart.items.length > 0 && (
                  <span className="badge bg-primary position-absolute top-0 start-100 translate-middle">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle fa-lg me-2"></i>
                  <span className="d-none d-lg-inline">{user.name}</span>
                  <i className="fas fa-chevron-down ms-1 d-lg-none"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <i className="fas fa-shopping-bag me-2"></i>Orders
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    <span className="d-none d-lg-inline">Login</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
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