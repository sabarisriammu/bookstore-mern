# 📚 MERN Stack Bookstore

A complete full-stack online bookstore application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring modern UI design, comprehensive functionality, and scalable architecture.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT authentication
- **Role-based Access Control** (User/Admin)
- **Profile Management** with address and contact information
- **Password Security** with bcrypt encryption

### 📖 Book Management
- **Comprehensive Book Catalog** with detailed information
- **Advanced Search & Filtering** by category, price, author, etc.
- **Book Categories** (Fiction, Non-Fiction, Science Fiction, etc.)
- **Featured, Bestseller & New Release** flags
- **Book Details** with reviews, ratings, and descriptions

### 🛒 Shopping Experience
- **Shopping Cart** with quantity management
- **Wishlist** functionality
- **Add to Cart & Buy Now** buttons
- **Stock Management** with availability indicators

### 📋 Order Management
- **Complete Order Processing** with shipping details
- **Order History** for users
- **Order Status Tracking** (Pending, Processing, Shipped, Delivered)
- **Admin Order Management** with status updates

### ⭐ Reviews & Ratings
- **Star Rating System** (1-5 stars)
- **User Reviews** with comments
- **Review Verification** (only purchasers can review)
- **Average Rating Calculation**

### 👨‍💼 Admin Panel
- **Book Management** (Add, Edit, Delete books)
- **User Management** with role assignment
- **Order Processing** and status management
- **Inventory Management**

### 🎨 Modern UI/UX
- **Responsive Design** that works on all devices
- **Tailwind CSS** for beautiful styling
- **React Icons** for consistent iconography
- **Smooth Animations** and transitions
- **Loading States** and error handling

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-bookstore
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `backend/config.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud service)
   ```

5. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the application**
   ```bash
   # From root directory
   npm run dev
   
   # Or start separately:
   # Backend: cd backend && npm run dev
   # Frontend: cd frontend && npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
mern-bookstore/
├── backend/
│   ├── config.env
│   ├── server.js
│   ├── package.json
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── users.js
│   │   ├── orders.js
│   │   └── reviews.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── seedData.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── BookCard.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── AdminRoute.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Books.js
│   │   │   ├── BookDetails.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Profile.js
│   │   │   ├── Orders.js
│   │   │   ├── Wishlist.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── package.json
```

## 🔑 Test Accounts

After running the seed script, you'll have these test accounts:

- **Admin User**
  - Email: `admin@bookstore.com`
  - Password: `admin123`

- **Regular User**
  - Email: `test@bookstore.com`
  - Password: `test123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Books
- `GET /api/books` - Get all books (with filtering)
- `GET /api/books/:id` - Get single book
- `GET /api/books/featured` - Get featured books
- `GET /api/books/bestsellers` - Get bestseller books
- `GET /api/books/new-releases` - Get new releases
- `GET /api/books/search` - Search books

### Cart & Wishlist
- `GET /api/users/cart` - Get user cart
- `POST /api/users/cart` - Add to cart
- `PUT /api/users/cart/:bookId` - Update cart item
- `DELETE /api/users/cart/:bookId` - Remove from cart
- `GET /api/users/wishlist` - Get wishlist
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:bookId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `POST /api/reviews/:bookId` - Add review
- `PUT /api/reviews/:bookId` - Update review
- `DELETE /api/reviews/:bookId` - Delete review
- `GET /api/reviews/:bookId` - Get book reviews

## 🎯 Key Features Implemented

✅ **Complete User Authentication System**
✅ **Comprehensive Book Management**
✅ **Shopping Cart & Wishlist**
✅ **Order Processing & Management**
✅ **Reviews & Ratings System**
✅ **Admin Panel with Full CRUD**
✅ **Responsive Design**
✅ **Search & Filtering**
✅ **Input Validation & Error Handling**
✅ **Security Features**
✅ **Database Seeding**
✅ **Modern UI/UX**

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or production MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the database
- All the open-source contributors whose packages made this possible

---

**Happy Reading! 📖✨** 