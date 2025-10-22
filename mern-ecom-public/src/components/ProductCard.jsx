import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 1, product.discountPrice || product.price);
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 product-card hover-shadow">
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <div className="card-img-container" style={{ height: '200px', overflow: 'hidden' }}>
            {product.images && product.images.length > 0 ? (
              <img
                src={`http://localhost:5001${product.images[0]}`}
                className="card-img-top img-fluid"
                alt={product.name}
                style={{ height: '100%', objectFit: 'cover' }}
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Product card image failed to load:', product.images[0]);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                <i className="fas fa-image fa-3x text-muted"></i>
              </div>
            )}
          </div>
        </Link>

        <div className="card-body d-flex flex-column">
          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
            <h6 className="card-title mb-2">{product.name}</h6>
          </Link>

          <div className="mt-auto">
            <div className="d-flex align-items-center mb-2">
              {product.discountPrice ? (
                <>
                  <span className="text-decoration-line-through text-muted me-2">
                    ${product.price}
                  </span>
                  <span className="fw-bold text-success">
                    ${product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="fw-bold">${product.price}</span>
              )}
            </div>

            <div className="d-flex gap-2">
              <Link
                to={`/products/${product._id}`}
                className="btn btn-outline-primary btn-sm flex-fill"
              >
                View Details
              </Link>
              <button
                className="btn btn-primary btn-sm flex-fill"
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        </div>

        {product.isFeatured && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-warning text-dark">Featured</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;