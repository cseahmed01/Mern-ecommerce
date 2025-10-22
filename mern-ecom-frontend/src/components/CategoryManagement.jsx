import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../api/config'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', image: null, status: true })
  const [imagePreview, setImagePreview] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchCategories()
  }, [navigate])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }

      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('status', formData.status)
      if (formData.image) {
        submitData.append('image', formData.image)
      }

      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/categories/${editingCategory._id}`, submitData, config)
      } else {
        await axios.post(`${API_BASE_URL}/categories`, submitData, config)
      }

      setShowModal(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '', image: null, status: true })
      setImagePreview('')
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      image: null,
      status: category.status
    })
    setImagePreview(category.image || '')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_BASE_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '', image: null, status: true })
    setImagePreview('')
    setShowModal(true)
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
        <h2 className="mb-3 mb-sm-0">Category Management</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i>Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
              <tr key={category._id}>
                <td>
                  {category.image && (
                    <img
                      src={`http://localhost:5001${category.image}`}
                      alt={category.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('Category image failed to load:', category.image);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <span className={`badge ${category.status ? 'bg-success' : 'bg-danger'}`}>
                    {category.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="d-flex flex-column flex-sm-row gap-1">
                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(category)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category._id)}>
                      Delete
                    </button>
                  </div>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        setFormData({ ...formData, image: file })
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => setImagePreview(e.target.result)
                          reader.readAsDataURL(file)
                        } else {
                          setImagePreview('')
                        }
                      }}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img src={imagePreview.startsWith('http') ? imagePreview : imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                      </div>
                    )}
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="status"
                      checked={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="status">
                      Active
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Update' : 'Create'}
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

export default CategoryManagement