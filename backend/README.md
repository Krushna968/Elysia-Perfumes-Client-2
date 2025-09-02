# Elysia Perfumes - Backend API

A comprehensive Node.js/Express backend for the Elysia Perfumes e-commerce platform with admin panel, payment integration, and inventory management.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication for customers and admins
- Role-based access control (Customer, Admin, Super Admin)
- Password reset and email verification
- Secure session management

### 🛍️ Store Management
- **Product Management**: Complete CRUD operations for perfumes and variants
- **Category Management**: Hierarchical category system
- **Inventory Tracking**: Real-time stock management with low stock alerts
- **Order Management**: Full order lifecycle management
- **Customer Database**: Complete customer profiles with order history

### 💰 Payment Integration
- **Razorpay Integration**: Primary payment gateway
- **Multiple Payment Methods**: UPI, Cards, Net Banking, COD
- **GST/Tax Configuration**: Automatic tax calculation for Indian compliance
- **Invoice Generation**: Auto-generated PDF invoices
- **Webhook Handling**: Real-time payment status updates

### 🚚 Shipping & Logistics
- **Shipping Calculations**: Dynamic shipping cost calculation
- **Partner Integration**: Ready for Shiprocket, BlueDart, Delhivery
- **Tracking System**: Order tracking with status updates
- **Return Management**: Complete return and refund workflow

### 🎯 Marketing & Analytics
- **Discount System**: Flexible promo codes and discount management
- **Analytics Dashboard**: Sales, revenue, and product performance metrics
- **Email Marketing**: Newsletter signup and order notifications
- **SEO Optimization**: Meta tags and search optimization

### 🔒 Security Features
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Security**: Security headers
- **Data Encryption**: Secure password hashing

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Utility functions
├── scripts/         # Database scripts
├── templates/       # Email templates
├── uploads/         # File uploads
├── logs/           # Application logs
├── server.js       # Main server file
└── package.json    # Dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Razorpay account
- Cloudinary account (for image uploads)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Fill in your environment variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: From your Razorpay dashboard
- `CLOUDINARY_*`: Your Cloudinary credentials
- `EMAIL_*`: Email service configuration

### 3. Database Setup
```bash
# Seed initial data (categories, admin user)
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register          # Customer registration
POST /api/auth/login             # Customer login
POST /api/auth/admin/login       # Admin login
POST /api/auth/logout            # Logout
GET  /api/auth/me                # Get current user
PUT  /api/auth/profile           # Update profile
PUT  /api/auth/password          # Change password
POST /api/auth/forgot-password   # Request password reset
PUT  /api/auth/reset-password/:token # Reset password
```

### Product Endpoints
```
GET  /api/products              # Get all products (public)
GET  /api/products/:slug        # Get single product
GET  /api/products/featured     # Get featured products
GET  /api/products/bestsellers  # Get best selling products
GET  /api/products/search       # Search products
```

### Admin Endpoints
```
GET  /api/admin/products        # Get all products (admin)
POST /api/admin/products        # Create product
GET  /api/admin/products/:id    # Get single product (admin)
PUT  /api/admin/products/:id    # Update product
DELETE /api/admin/products/:id  # Delete product
PUT  /api/admin/products/:id/stock # Update stock
```

### Payment Endpoints
```
POST /api/payments/create-order    # Create Razorpay order
POST /api/payments/verify-payment  # Verify payment
POST /api/payments/cod-order       # Create COD order
POST /api/payments/webhook         # Razorpay webhook
GET  /api/payments/methods         # Get payment methods
```

## 🔧 Configuration

### Database Models
- **User**: Customer and admin accounts with addresses and cart
- **Product**: Perfumes with variants, inventory, and SEO data
- **Category**: Hierarchical product categories
- **Order**: Complete order management with payment and shipping
- **Discount**: Flexible discount and promo code system

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting for sensitive operations
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

### Payment Integration
- Razorpay for online payments
- Cash on Delivery (COD) support
- Automatic inventory reduction on successful orders
- GST tax calculation for Indian compliance
- PDF invoice generation

## 🚀 Deployment

### Option 1: Render (Recommended)
1. Connect your GitHub repository to Render
2. Configure environment variables in Render dashboard
3. Deploy with these settings:
   ```
   Build Command: npm install
   Start Command: npm start
   ```

### Option 2: Heroku
1. Install Heroku CLI
2. Create Heroku app: `heroku create elysia-perfumes-api`
3. Set environment variables: `heroku config:set KEY=value`
4. Deploy: `git push heroku main`

### Environment Variables for Production
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-super-secure-jwt-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 📊 Admin Panel Features

### Dashboard Analytics
- Total sales and revenue
- Order statistics
- Best-selling products
- Customer analytics
- Inventory alerts

### Product Management
- Add/Edit/Delete products
- Bulk operations
- Image upload with Cloudinary
- Variant management
- Stock tracking

### Order Management
- View all orders
- Update order status
- Process returns and refunds
- Generate invoices
- Customer communication

### Discount Management
- Create promo codes
- Set usage limits
- Geographic restrictions
- Time-based offers
- Analytics tracking

## 🔒 Security Best Practices

- All passwords are hashed with bcrypt
- JWT tokens for stateless authentication
- Rate limiting on sensitive endpoints
- Input validation on all endpoints
- CORS configuration for frontend domain
- Security headers with Helmet
- Audit logging for admin actions

## 📧 Email Integration

The system supports email notifications for:
- Welcome emails for new customers
- Order confirmations
- Shipping updates
- Password reset links
- Invoice delivery

## 🛡️ Legal Compliance

- GDPR compliant data handling
- Indian data protection compliance
- Terms and conditions management
- Privacy policy endpoints
- Return/refund policy implementation

## 🏃‍♂️ Quick Start for Development

1. Clone and setup:
```bash
git clone <repository-url>
cd backend
npm install
cp .env.example .env
```

2. Configure `.env` with your credentials

3. Start development:
```bash
npm run dev
```

4. Test the API:
```bash
curl http://localhost:5000/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Email: support@elysiaperfumes.in
- Create an issue in the repository

---

Built with ❤️ for Elysia Perfumes
