import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import API_BASE_URL from '../api/config';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, bannersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products?featured=true&limit=8`),
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/banners`)
      ]);

      setFeaturedProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
      setBanners(bannersRes.data.banners);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      {/* Hero Banner */}
      {banners.length > 0 && (
        <div id="heroCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
          <div className="carousel-inner">
            {banners.map((banner, index) => (
              <div key={banner._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                  src={banner.image}
                  className="d-block w-100"
                  alt={banner.title}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>{banner.title}</h5>
                  <p>{banner.description}</p>
                </div>
              </div>
            ))}
          </div>
          {banners.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Categories Section */}
      <section className="mb-5">
        <div className="container">
          <h2 className="text-center mb-4">Shop by Category</h2>
          <div className="row">
            {categories.slice(0, 6).map((category) => (
              <div key={category._id} className="col-lg-2 col-md-4 col-sm-6 mb-3">
                <Link to={`/products?category=${category._id}`} className="text-decoration-none">
                  <div className="card text-center hover-shadow">
                    {category.image && (
                      <img
                        src={category.image}
                        className="card-img-top"
                        alt={category.name}
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="card-title mb-0">{category.name}</h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Featured Products</h2>
            <Link to="/products" className="btn btn-outline-primary">
              View All Products
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="row">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div className="card h-100 product-card hover-shadow">
                    <Link to={`/products/${product._id}`} className="text-decoration-none">
                      <div className="card-img-container" style={{ height: '200px', overflow: 'hidden' }}>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            className="card-img-top img-fluid"
                            alt={product.name}
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                            <i className="fas fa-image fa-3x text-muted"></i>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="card-body d-flex flex-column">
                      <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
                        <h6 className="card-title mb-2">{product.name}</h6>
                      </Link>

                      <div className="mt-auto">
                        <div className="d-flex align-items-center mb-2">
                          {product.discountPrice ? (
                            <>
                              <span className="text-decoration-line-through text-muted me-2">
                                ${product.price}
                              </span>
                              <span className="fw-bold text-success">
                                ${product.discountPrice}
                              </span>
                            </>
                          ) : (
                            <span className="fw-bold">${product.price}</span>
                          )}
                        </div>

                        <Link
                          to={`/products/${product._id}`}
                          className="btn btn-primary w-100"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-warning text-dark">Featured</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;