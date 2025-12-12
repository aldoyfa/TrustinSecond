import express from 'express';
import cookierParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import inventoryRoutes from './routes/inventory.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import invoiceRoutes from './routes/invoice.route.js';

//load .env 
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 15151;

// Middleware
app.use(cookierParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/statistics', invoiceRoutes); // not implemented yet

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 