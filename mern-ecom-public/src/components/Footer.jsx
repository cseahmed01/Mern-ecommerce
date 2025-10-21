const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>MERN Shop</h5>
            <p>Your one-stop shop for all your needs. Quality products at affordable prices.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/products" className="text-light text-decoration-none">Products</a></li>
              <li><a href="/categories" className="text-light text-decoration-none">Categories</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Info</h5>
            <p>
              <i className="fas fa-envelope me-2"></i> support@mernshop.com<br />
              <i className="fas fa-phone me-2"></i> +1 (555) 123-4567<br />
              <i className="fas fa-map-marker-alt me-2"></i> 123 Commerce St, City, State
            </p>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; 2024 MERN Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;