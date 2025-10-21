import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
          <h2>Your cart is empty</h2>
          <p className="text-muted mb-4">Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <i className="fas fa-shopping-bag me-2"></i>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Shopping Cart</h1>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Cart Items ({cart.items.length})</h5>
            </div>
            <div className="card-body p-0">
              {cart.items.map((item) => (
                <div key={item.productId} className="border-bottom p-3">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-4">
                      <h6 className="mb-1">{item.name}</h6>
                      <small className="text-muted">Unit Price: ${item.price}</small>
                    </div>
                    <div className="col-md-3">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={updatingItems.has(item.productId)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center mx-2"
                          style={{ width: '60px' }}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                          min="1"
                          disabled={updatingItems.has(item.productId)}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={updatingItems.has(item.productId)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                    <div className="col-md-1">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cart.items.length} items):</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${cart.totalAmount.toFixed(2)}</strong>
              </div>

              <button
                className="btn btn-primary w-100 mb-2"
                onClick={handleCheckout}
                disabled={loading}
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              <Link to="/products" className="btn btn-outline-primary w-100">
                Continue Shopping
              </Link>
            </div>
          </div>

          {!user && (
            <div className="alert alert-info mt-3">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Have an account?</strong> Login to save your cart and access faster checkout.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;