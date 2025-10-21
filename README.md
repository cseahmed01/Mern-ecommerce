# MERN E-commerce Project

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Project Structure

```
mern-ecommerce/
├── mern-ecom-backend/          # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── config/            # Database configuration
│   │   ├── utils/             # Utility functions
│   │   ├── scripts/           # Database seeding scripts
│   │   └── app.js             # Express app setup
│   └── package.json
│
└── mern-ecom-public/           # Public Frontend (React/Vite)
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── contexts/          # React Context for state management
    │   ├── api/               # API configuration
    │   └── App.jsx            # Main app component
    └── package.json
```

## Features

### Backend API
- **Authentication**: JWT-based auth for admin and customers
- **Product Management**: CRUD operations for products
- **Category Management**: Organize products by categories
- **Cart Management**: Shopping cart functionality
- **Order Management**: Order processing and tracking
- **Banner Management**: Dynamic homepage banners

### Public Frontend
- **Home Page**: Featured products, categories, and banners
- **Product Catalog**: Browse products with filtering and search
- **Product Details**: Detailed product view with image gallery
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login/register for customers
- **Responsive Design**: Mobile-friendly Bootstrap UI

## Design Patterns Used

### 1. **Component-Based Architecture**
- **Atomic Design**: Components are organized into reusable atoms, molecules, and organisms
- **Separation of Concerns**: Each component has a single responsibility
- **Props Interface**: Clear data flow through props

### 2. **State Management**
- **Context API**: Global state management for authentication and cart
- **Local State**: Component-level state for UI interactions
- **Custom Hooks**: Reusable logic extraction (useAuth, useCart)

### 3. **API Integration Pattern**
- **Centralized API Config**: Single source of truth for API endpoints
- **Axios Interceptors**: Automatic token handling and error management
- **Async/Await**: Clean asynchronous code with proper error handling

### 4. **Routing Architecture**
- **Protected Routes**: Authentication-based route protection
- **Nested Routes**: Hierarchical routing structure
- **Dynamic Routing**: URL-based product/category filtering

### 5. **Backend Architecture**
- **MVC Pattern**: Models, Views (routes), Controllers (route handlers)
- **Middleware Chain**: Request processing pipeline
- **Error Handling**: Centralized error management
- **Authentication Middleware**: JWT validation and role-based access

### 6. **Database Design**
- **Schema Design**: Proper relationships and data validation
- **Indexing**: Optimized queries with MongoDB indexes
- **Population**: Efficient data fetching with Mongoose populate

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd mern-ecom-backend
npm install
# Set up environment variables in .env
npm run dev
```

### Public Frontend Setup
```bash
cd mern-ecom-public
npm install
# Set up environment variables in .env
npm run dev
```

### Admin Panel Setup
```bash
cd mern-ecom-frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:productId` - Remove item from cart

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

## Environment Variables

### Backend (.env)
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/mern_ecom
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Public Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5001/api
```

## Technologies Used

- **Frontend**: React, React Router, Bootstrap, Axios, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Font Awesome
- **State Management**: React Context API
- **Build Tools**: Vite, ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.