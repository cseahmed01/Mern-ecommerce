import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import API_BASE_URL from '../api/config';

const ProductList = ({ categoryId, searchQuery, featuredOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchQuery, featuredOnly, currentPage, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${API_BASE_URL}/products?page=${currentPage}&limit=12&sortBy=${sortBy}&sortOrder=${sortOrder}`;

      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      if (featuredOnly) {
        url += `&featured=true`;
      }

      const response = await axios.get(url);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
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

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
        <button className="btn btn-outline-danger ms-3" onClick={fetchProducts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h4>No products found</h4>
          <p className="text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductList;