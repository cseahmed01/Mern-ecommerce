// src/components/ProductManagement.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../api/config'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    brand: '',
    price: '',
    discountPrice: '',
    stock: '',
    images: [],
    tags: [],
    isFeatured: false,
    status: true
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchProducts()
    fetchCategories()
  }, [navigate])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, formData, config)
      } else {
        await axios.post(`${API_BASE_URL}/products`, formData, config)
      }

      setShowModal(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        brand: '',
        price: '',
        discountPrice: '',
        stock: '',
        images: [],
        tags: [],
        isFeatured: false,
        status: true
      })
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId?._id || product.categoryId || '',
      brand: product.brand || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      images: product.images || [],
      tags: product.tags || [],
      isFeatured: product.isFeatured || false,
      status: product.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_BASE_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      brand: '',
      price: '',
      discountPrice: '',
      stock: '',
      images: [],
      tags: [],
      isFeatured: false,
      status: true
    })
    setShowModal(true)
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.categoryId?.name || 'N/A'}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.status ? 'bg-success' : 'bg-danger'}`}>
                    {product.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>
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
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
                      <label htmlFor="price" className="form-label">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="categoryId" className="form-label">Category</label>
                      <select
                        className="form-control"
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="discountPrice" className="form-label">Discount Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="discountPrice"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="brand" className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="stock" className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        id="stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="images" className="form-label">Images (comma separated URLs)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="images"
                        value={formData.images.join(', ')}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(url => url.trim()) })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="isFeatured">
                        Featured Product
                      </label>
                    </div>
                    <div className="col-md-6 mb-3 form-check">
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
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update' : 'Create'}
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

export default ProductManagement