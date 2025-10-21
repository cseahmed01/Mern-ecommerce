import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import API_BASE_URL from '../api/config';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(response.data.product);
    } catch (err) {
      setError('Product not found or failed to load.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity, product.discountPrice || product.price);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center" role="alert">
          {error || 'Product not found.'}
          <div className="mt-3">
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        {/* Product Images */}
        <div className="col-lg-6 mb-4">
          <div className="row">
            <div className="col-12 mb-3">
              <img
                src={product.images?.[selectedImage] || '/placeholder-image.jpg'}
                alt={product.name}
                className="img-fluid rounded"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="col-12">
                <div className="d-flex gap-2 overflow-auto">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`rounded cursor-pointer ${selectedImage === index ? 'border border-primary' : ''}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <h1 className="mb-3">{product.name}</h1>

          {product.isFeatured && (
            <span className="badge bg-warning text-dark mb-3">Featured Product</span>
          )}

          <div className="mb-3">
            {product.discountPrice ? (
              <div>
                <span className="h4 text-decoration-line-through text-muted me-2">
                  ${product.price}
                </span>
                <span className="h3 text-success fw-bold">
                  ${product.discountPrice}
                </span>
                <div className="text-muted">
                  You save ${(product.price - product.discountPrice).toFixed(2)}
                </div>
              </div>
            ) : (
              <span className="h3 fw-bold">${product.price}</span>
            )}
          </div>

          <div className="mb-3">
            <strong>Availability:</strong>{' '}
            <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          {product.brand && (
            <div className="mb-3">
              <strong>Brand:</strong> {product.brand}
            </div>
          )}

          {product.categoryId && (
            <div className="mb-3">
              <strong>Category:</strong> {product.categoryId.name}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-3">
            <label className="form-label fw-bold">Quantity:</label>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center"
                style={{ width: '80px' }}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={product.stock}
              />
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="d-grid gap-2 mb-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock === 0}
            >
              {cartLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Adding...
                </>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <i className="fas fa-cart-plus me-2"></i>
                  Add to Cart - ${(quantity * (product.discountPrice || product.price)).toFixed(2)}
                </>
              )}
            </button>
          </div>

          {/* Product Description */}
          {product.description && (
            <div>
              <h4>Description</h4>
              <p>{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-3">
              <strong>Tags:</strong>
              <div className="mt-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="badge bg-secondary me-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;