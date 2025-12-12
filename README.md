# TrustinSecond - E-Commerce Platform

A modern full-stack e-commerce web application for buying and selling second-hand electronics. Built with React, Express.js, and MySQL.

Try it at: [trustinsecond.ykd.dev](https://trustinsecond.ykd.dev)

**STI K3 - Layanan STI Kelompok 5**  
- Aldoy Fauzan Avanza - 18223113  
- M Rabbani K A - 18223130  
- Muhammad Rafly Fauzan - 18223132  
- Geraldo Linggom Samuel T - 18223136                 

## About

TrustinSecond is a comprehensive e-commerce platform that allows users to:
- Browse and search products
- Add items to cart and checkout
- View product details and inventory
- Admin dashboard for managing products, inventory, and invoices
- User authentication and authorization

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **Prisma** - ORM for database management
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aldoyfa/TrustinSecond.git
   cd TrustinSecond
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:3306/trustinsecond"
   JWT_SECRET="your-secret-key"
   PORT=5000
   ```

5. **Run database migrations**
   ```bash
   cd server
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   cd ..
   ```

## Running the Development Server

**Start Backend Server**
```bash
cd server
node src/server.js
```
The backend server will run on `http://localhost:15151`

**Start Frontend Development Server** (in a new terminal)
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:15152`


## Project Structure

```
TrustinSecond/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.jsx     # Main layout with navigation
│   │   │   └── ProductCard.jsx # Product card component
│   │   ├── contexts/          # React contexts
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   └── CartContext.jsx # Shopping cart state
│   │   ├── pages/             # Page components
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── InventoryListPage.jsx
│   │   │   ├── InventoryProductsPage.jsx
│   │   │   ├── InvoicesPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── SignInPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── App.jsx            # Main app component with routes
│   │   ├── main.jsx           # Entry point
│   │   └── styles.css         # Global styles (centralized)
│   ├── index.html
│   ├── package.json
│   └── vite.config.mjs
│
└── server/                     # Backend Node.js application
    ├── src/
    │   ├── config/            # Configuration files
    │   │   └── prisma.js      # Prisma client instance
    │   ├── controllers/       # Route controllers
    │   │   ├── auth.controller.js
    │   │   ├── cart.controller.js
    │   │   ├── inventory.controller.js
    │   │   ├── invoice.controller.js
    │   │   └── product.controller.js
    │   ├── middlewares/       # Express middlewares
    │   │   ├── upload.js      # Multer file upload
    │   │   └── verifyToken.js # JWT authentication
    │   ├── routes/            # API routes
    │   │   ├── auth.route.js
    │   │   ├── cart.route.js
    │   │   ├── inventory.route.js
    │   │   ├── invoice.route.js
    │   │   └── product.route.js
    │   ├── utils/             # Utility functions
    │   │   ├── cookieOptions.js
    │   │   └── response.js
    │   └── server.js          # Express server entry point
    │
    ├── prisma/                # Prisma schema and migrations
    │   ├── schema.prisma
    │   └── migrations/
    │
    ├── uploads/               # Uploaded product images
    ├── .env                   # Environment variables
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/inventory/:id` - Get products by inventory ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Inventory
- `GET /api/inventory` - Get all inventories
- `GET /api/inventory/:id` - Get inventory by ID
- `POST /api/inventory` - Create inventory (Admin)
- `PUT /api/inventory/:id` - Update inventory (Admin)
- `DELETE /api/inventory/:id` - Delete inventory (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

### Invoice
- `GET /api/invoice` - Get all invoices (Admin)
- `GET /api/invoice/:id` - Get invoice by ID
- `POST /api/invoice/checkout` - Create invoice from cart
- `PUT /api/invoice/:id` - Update invoice (Admin)
- `DELETE /api/invoice/:id` - Delete invoice (Admin)

## Features

### User Features
- Product browsing with search functionality
- Product details view
- Shopping cart management
- Checkout process
- Invoice viewing
- Inventory categories

### Admin Features
- Product management (CRUD)
- Inventory management (CRUD)
- Invoice management
- Image upload for products
- Dashboard with tabs interface

