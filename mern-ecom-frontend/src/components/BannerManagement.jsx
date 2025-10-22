// src/components/BannerManagement.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../api/config'

import { Carousel } from 'bootstrap'

const BannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    isActive: true
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize carousel after component mounts and banners are loaded
    const initializeCarousel = () => {
      const carouselElement = document.getElementById('bannerPreviewCarousel');
      if (carouselElement && banners.filter(b => b.isActive).length > 0) {
        // Destroy existing carousel if it exists
        const existingCarousel = Carousel.getInstance(carouselElement);
        if (existingCarousel) {
          existingCarousel.dispose();
        }

        // Create new carousel instance
        const carousel = new Carousel(carouselElement, {
          interval: 3000,
          wrap: true,
          ride: 'carousel'
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeCarousel, 100);

    return () => clearTimeout(timeoutId);
  }, [banners]);

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
      // Reset image loading states
      setImageLoading({})
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

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('link', formData.link)
      formDataToSend.append('isActive', formData.isActive)

      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }

      if (editingBanner) {
        await axios.put(`${API_BASE_URL}/banners/${editingBanner._id}`, formDataToSend, config)
      } else {
        await axios.post(`${API_BASE_URL}/banners`, formDataToSend, config)
      }

      setShowModal(false)
      setEditingBanner(null)
      setFormData({
        title: '',
        link: '',
        isActive: true
      })
      setSelectedFile(null)
      setImagePreview('')
      fetchBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      link: banner.link || '',
      isActive: banner.isActive
    })
    // Set the image preview to the existing banner image URL
    const imageUrl = `${API_BASE_URL.replace('/api', '')}${banner.image}`
    setImagePreview(imageUrl)
    console.log('Setting image preview for edit:', imageUrl)
    setSelectedFile(null)
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
      link: '',
      isActive: true
    })
    setSelectedFile(null)
    setImagePreview('')
    setShowModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
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
        <>
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="mb-3">
                <i className="fas fa-images me-2"></i>Banner Preview Carousel
              </h4>
              {banners.filter(b => b.isActive).length > 0 && (
                <div id="bannerPreviewCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-wrap="true">
                  <div className="carousel-indicators">
                    {banners.filter(b => b.isActive).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#bannerPreviewCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                  <div className="carousel-inner rounded shadow">
                    {banners.filter(b => b.isActive).map((banner, index) => (
                      <div key={banner._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                          src={`${API_BASE_URL.replace('/api', '')}${banner.image}`}
                          className="d-block w-100"
                          alt={banner.title}
                          style={{ height: '300px', objectFit: 'cover' }}
                          crossOrigin="anonymous"
                        />
                        <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                          <h5>{banner.title}</h5>
                          {banner.link && (
                            <a href={banner.link} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                              Learn More
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {banners.filter(b => b.isActive).length > 1 && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target="#bannerPreviewCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#bannerPreviewCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className="mb-3">
                <i className="fas fa-th-large me-2"></i>Manage Banners
              </h4>
            </div>
            {banners.length > 0 ? (
              banners.map((banner) => (
                <div key={banner._id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      {imageLoading[banner._id] && (
                        <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '200px' }}>
                          <div className="text-center">
                            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted small mb-0">Loading image...</p>
                          </div>
                        </div>
                      )}
                      <img
                        src={`${API_BASE_URL.replace('/api', '')}${banner.image}`}
                        alt={banner.title}
                        className="card-img-top"
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          display: imageLoading[banner._id] ? 'none' : 'block'
                        }}
                        loading="lazy"
                        onLoad={() => setImageLoading(prev => ({ ...prev, [banner._id]: false }))}
                        onLoadStart={() => setImageLoading(prev => ({ ...prev, [banner._id]: true }))}
                        onError={(e) => {
                          console.error('Banner image failed to load:', banner.image);
                          setImageLoading(prev => ({ ...prev, [banner._id]: false }));
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="d-none d-flex align-items-center justify-content-center bg-light position-absolute top-0 start-0 w-100 h-100">
                        <div className="text-center">
                          <i className="fas fa-image fa-2x text-muted mb-2"></i>
                          <p className="text-muted small mb-0">Image not available</p>
                        </div>
                      </div>
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className={`badge ${banner.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title fw-bold">{banner.title}</h6>
                      {banner.link && (
                        <p className="card-text text-muted small">
                          <i className="fas fa-link me-1"></i>
                          {banner.link.length > 30 ? `${banner.link.substring(0, 30)}...` : banner.link}
                        </p>
                      )}
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(banner.createdAt).toLocaleDateString()}
                          </small>
                          <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            {new Date(banner.updatedAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-warning btn-sm flex-fill"
                            onClick={() => handleEdit(banner)}
                          >
                            <i className="fas fa-edit me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm flex-fill"
                            onClick={() => handleDelete(banner._id)}
                          >
                            <i className="fas fa-trash me-1"></i>Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <i className="fas fa-images fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No banners found</h5>
                  <p className="text-muted">Create your first banner to get started</p>
                </div>
              </div>
            )}
        </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className={`fas ${editingBanner ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label htmlFor="title" className="form-label fw-bold">
                            <i className="fas fa-heading me-1"></i>Title
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter banner title"
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label htmlFor="link" className="form-label fw-bold">
                            <i className="fas fa-link me-1"></i>Link (optional)
                          </label>
                          <input
                            type="url"
                            className="form-control"
                            id="link"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label htmlFor="image" className="form-label fw-bold">
                            <i className="fas fa-image me-1"></i>Banner Image
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            required={!editingBanner}
                          />
                          <small className="form-text text-muted">Supported formats: JPEG, PNG, GIF, WebP (Max: 5MB)</small>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="isActive"
                              checked={formData.isActive}
                              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            <label className="form-check-label fw-bold" htmlFor="isActive">
                              <i className="fas fa-toggle-on me-1"></i>Active Banner
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-light">
                        <div className="card-body text-center">
                          <h6 className="card-title fw-bold mb-3">
                            <i className="fas fa-eye me-1"></i>Preview
                          </h6>
                          {imagePreview ? (
                            <div className="position-relative">
                              <img
                                src={imagePreview}
                                alt="Banner Preview"
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                              />
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className={`badge ${formData.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                  {formData.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          ) : editingBanner ? (
                            <div className="position-relative">
                              <img
                                src={imagePreview || `${API_BASE_URL.replace('/api', '')}${editingBanner.image}`}
                                alt="Current Banner"
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  console.error('Failed to load current banner image:', e.target.src);
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                              <div className="d-none d-flex align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100 bg-light rounded">
                                <div className="text-center">
                                  <i className="fas fa-image fa-2x text-muted mb-2"></i>
                                  <p className="text-muted small mb-0">Image not available</p>
                                </div>
                              </div>
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className={`badge ${formData.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                  {formData.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center p-4">
                              <i className="fas fa-image fa-3x text-muted mb-3"></i>
                              <p className="text-muted mb-0">No image selected</p>
                              <small className="text-muted">Upload an image to see preview</small>
                            </div>
                          )}
                          {formData.title && (
                            <h6 className="mt-3 fw-bold text-truncate">{formData.title}</h6>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    <i className="fas fa-times me-1"></i>Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className={`fas ${editingBanner ? 'fa-save' : 'fa-plus'} me-1`}></i>
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
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