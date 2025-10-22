import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        }
      });
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');

    if (tab === 'orders' && orders.length === 0) {
      fetchOrders();
    } else if (tab === 'wishlist' && wishlist.length === 0) {
      fetchWishlist();
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(profileData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">My Account</h1>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => handleTabChange('password')}
          >
            Change Password
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            Order History
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => handleTabChange('wishlist')}
          >
            Wishlist
          </button>
        </li>
      </ul>

      {/* Status Message */}
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Profile Information</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleProfileUpdate}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="street" className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    value={profileData.address.street}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: {...profileData.address, street: e.target.value}
                    })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    value={profileData.address.city}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: {...profileData.address, city: e.target.value}
                    })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    value={profileData.address.state}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: {...profileData.address, state: e.target.value}
                    })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="postalCode" className="form-label">Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="postalCode"
                    value={profileData.address.postalCode}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: {...profileData.address, postalCode: e.target.value}
                    })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    value={profileData.address.country}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: {...profileData.address, country: e.target.value}
                    })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Change Password</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Order History</h5>
          </div>
          <div className="card-body">
            {orders.length === 0 ? (
              <p>You haven't placed any orders yet.</p>
            ) : (
              <div className="row">
                {orders.map((order) => (
                  <div key={order._id} className="col-12 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>Order #{order._id.slice(-8)}</h6>
                            <p className="mb-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="mb-1">Status: <span className="badge bg-primary">{order.orderStatus}</span></p>
                            <p className="mb-0">Total: ${order.totalAmount.toFixed(2)}</p>
                          </div>
                          <div className="text-end">
                            <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">My Wishlist</h5>
          </div>
          <div className="card-body">
            {wishlist.length === 0 ? (
              <p>Your wishlist is empty.</p>
            ) : (
              <div className="row">
                {wishlist.map((product) => (
                  <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div className="card h-100">
                      <img
                        src={product.images?.[0] ? `http://localhost:5001${product.images[0]}` : '/placeholder-image.jpg'}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '150px', objectFit: 'cover' }}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Wishlist product image failed to load:', product.images?.[0]);
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">{product.name}</h6>
                        <p className="card-text">
                          {product.discountPrice ? (
                            <>
                              <span className="text-decoration-line-through text-muted">${product.price}</span>
                              <span className="fw-bold text-success ms-2">${product.discountPrice}</span>
                            </>
                          ) : (
                            <span className="fw-bold">${product.price}</span>
                          )}
                        </p>
                        <div className="mt-auto">
                          <button
                            className="btn btn-outline-danger btn-sm me-2"
                            onClick={() => removeFromWishlist(product._id)}
                          >
                            Remove
                          </button>
                          <button className="btn btn-primary btn-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;