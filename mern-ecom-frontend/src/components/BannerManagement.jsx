// src/components/BannerManagement.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../api/config'

const BannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    isActive: true
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchBanners()
  }, [navigate])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/banners`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBanners(response.data.banners || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      if (editingBanner) {
        await axios.put(`${API_BASE_URL}/banners/${editingBanner._id}`, formData, config)
      } else {
        await axios.post(`${API_BASE_URL}/banners`, formData, config)
      }

      setShowModal(false)
      setEditingBanner(null)
      setFormData({
        title: '',
        image: '',
        link: '',
        isActive: true
      })
      fetchBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      image: banner.image,
      link: banner.link || '',
      isActive: banner.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_BASE_URL}/banners/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchBanners()
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      image: '',
      link: '',
      isActive: true
    })
    setShowModal(true)
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Banner Management</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i>Add Banner
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading banners...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Image</th>
                <th>Link</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
              <tr key={banner._id}>
                <td>{banner.title}</td>
                <td>
                  <img src={banner.image} alt={banner.title} style={{width: '50px', height: '30px', objectFit: 'cover'}} />
                </td>
                <td>{banner.link || 'N/A'}</td>
                <td>
                  <span className={`badge ${banner.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(banner.createdAt).toLocaleDateString()}</td>
                <td>{new Date(banner.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(banner)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(banner._id)}>
                    Delete
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingBanner ? 'Edit Banner' : 'Add Banner'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="title" className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="image" className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="link" className="form-label">Link (optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      id="link"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBanner ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerManagement