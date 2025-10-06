# Bookstore Backend API

A complete RESTful API for an online bookstore built with Node.js, Express.js, and MongoDB.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password encryption with bcrypt

- **Book Management**
  - CRUD operations for books
  - Search and filtering
  - Categories and tags
  - Featured, bestseller, and new release flags

- **Shopping Cart & Wishlist**
  - Add/remove items from cart
  - Update quantities
  - Wishlist management

- **Order Management**
  - Create and manage orders
  - Order status tracking
  - Payment processing simulation

- **Reviews & Ratings**
  - Add/edit/delete reviews
  - Star ratings (1-5)
  - Review verification (only purchasers can review)

- **Admin Panel**
  - User management
  - Book inventory management
  - Order processing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, rate limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud service)

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Books
- `GET /api/books` - Get all books (with filtering)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)
- `GET /api/books/featured` - Get featured books
- `GET /api/books/bestsellers` - Get bestseller books
- `GET /api/books/new-releases` - Get new releases
- `GET /api/books/categories` - Get book categories
- `GET /api/books/search` - Search books

### Users
- `GET /api/users/cart` - Get user cart
- `POST /api/users/cart` - Add item to cart
- `PUT /api/users/cart/:bookId` - Update cart item
- `DELETE /api/users/cart/:bookId` - Remove from cart
- `DELETE /api/users/cart` - Clear cart
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:bookId` - Remove from wishlist
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Reviews
- `POST /api/reviews/:bookId` - Add review
- `PUT /api/reviews/:bookId` - Update review
- `DELETE /api/reviews/:bookId` - Delete review
- `GET /api/reviews/:bookId` - Get book reviews
- `GET /api/reviews/user/my-reviews` - Get user's reviews

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Books with Filtering
```bash
GET /api/books?category=Fiction&minPrice=10&maxPrice=20&sort=price-asc&page=1&limit=12
```

### Add to Cart
```bash
POST /api/users/cart
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "bookId": "book_id_here",
  "quantity": 2
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "items": [
    {
      "book": "book_id_here",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "Credit Card"
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Validation

Input validation is handled using express-validator with custom error messages for:
- Email format
- Password strength
- Required fields
- Data types and ranges

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication with configurable expiration
- **Rate Limiting**: Prevents abuse with request rate limiting
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers for protection
- **Input Validation**: Comprehensive input sanitization

## Database Models

### User
- Authentication fields (email, password)
- Profile information (name, phone, address)
- Cart and wishlist arrays
- Role-based access control

### Book
- Book details (title, author, description, ISBN)
- Pricing and inventory
- Categories and tags
- Ratings and reviews
- Featured/bestseller flags

### Order
- Order items with quantities
- Shipping and payment information
- Status tracking
- Total calculations

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time
- `NODE_ENV` - Environment (development/production)

## Testing

Test accounts are created during seeding:
- **Admin**: admin@bookstore.com / admin123
- **User**: test@bookstore.com / test123

## Deployment

1. Set environment variables for production
2. Use a process manager like PM2
3. Set up MongoDB Atlas or production MongoDB instance
4. Configure reverse proxy (nginx)
5. Set up SSL certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 