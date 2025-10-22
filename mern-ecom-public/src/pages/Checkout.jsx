import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../api/config';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cart, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress,
        paymentMethod
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderId(response.data.order._id);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.items.length === 0) {
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-check-circle fa-4x text-success mb-4"></i>
                <h2 className="card-title">Order Placed Successfully!</h2>
                <p className="card-text">Your order has been placed and is being processed.</p>
                <p className="text-muted">Order ID: {orderId}</p>
                <div className="mt-4">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => navigate('/profile')}
                  >
                    View Orders
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/products')}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Checkout</h1>

      <div className="row">
        {/* Order Summary */}
        <div className="col-lg-4 order-lg-2 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {cart.items.map((item) => (
                <div key={item.productId} className="d-flex mb-3">
                  <img
                    src={item.image ? `http://localhost:5001${item.image}` : '/placeholder-image.jpg'}
                    alt={item.name}
                    className="img-fluid rounded me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                    <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-0">
                <strong>Total:</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="col-lg-8 order-lg-1">
          <form onSubmit={handlePlaceOrder}>
            {/* Shipping Address */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Shipping Address</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="street" className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="postalCode" className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Payment Method</h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    <strong>Cash on Delivery</strong>
                    <br />
                    <small className="text-muted">Pay when you receive your order</small>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="card"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled
                  />
                  <label className="form-check-label" htmlFor="card">
                    <strong>Credit/Debit Card</strong>
                    <br />
                    <small className="text-muted">Coming soon</small>
                  </label>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Placing Order...
                  </>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;