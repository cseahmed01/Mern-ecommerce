import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container-fluid px-2 px-sm-3">
        <div className="row justify-content-center w-100 mx-0">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 px-2 px-sm-3">
            <div className="card shadow-lg border-0 mx-auto" style={{backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px', maxWidth: '450px'}}>
              <div className="card-body p-3 p-sm-4">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="fas fa-user-shield fa-3x text-primary"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2 h4 h-sm-2">Admin Portal</h2>
                  <p className="text-muted small">Secure access to your dashboard</p>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 shadow-sm" role="alert" style={{borderRadius: '10px'}}>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 mb-sm-4">
                    <label htmlFor="email" className="form-label fw-semibold text-dark small">
                      <i className="fas fa-envelope me-2 text-primary"></i>Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-0 bg-light">
                        <i className="fas fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-0 bg-light ps-0"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your admin email"
                        required
                        disabled={loading}
                        style={{borderRadius: '0 10px 10px 0', fontSize: '0.9rem'}}
                      />
                    </div>
                  </div>

                  <div className="mb-3 mb-sm-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark small">
                      <i className="fas fa-lock me-2 text-primary"></i>Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-0 bg-light">
                        <i className="fas fa-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 bg-light ps-0"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                        style={{borderRadius: '0 10px 10px 0', fontSize: '0.9rem'}}
                      />
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-semibold"
                      disabled={loading}
                      style={{borderRadius: '10px', padding: '10px 12px', fontSize: '0.95rem', transition: 'all 0.3s ease'}}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3 mt-sm-4">
                  <small className="text-muted small">
                    <i className="fas fa-shield-alt me-1"></i>
                    Secure admin access only
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin