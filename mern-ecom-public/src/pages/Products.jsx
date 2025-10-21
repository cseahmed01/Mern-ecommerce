import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../components/ProductList';
import API_BASE_URL from '../api/config';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by ProductList component
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Filters</h5>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="mb-3">
                <label htmlFor="search" className="form-label">Search Products</label>
                <form onSubmit={handleSearch}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="submit">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="mb-3">
                <label className="form-label">Categories</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory) && (
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Products</h1>
            <div className="text-muted">
              {searchQuery && <span>Search: "{searchQuery}"</span>}
              {selectedCategory && categories.find(c => c._id === selectedCategory) && (
                <span> in {categories.find(c => c._id === selectedCategory).name}</span>
              )}
            </div>
          </div>

          <ProductList
            categoryId={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;