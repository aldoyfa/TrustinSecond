import express from 'express';
import cookierParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import inventoryRoutes from './routes/inventory.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import invoiceRoutes from './routes/invoice.route.js';
import statisticsRoutes from './routes/statistics.route.js';

//load .env 
dotenv.config();

const app = espress();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookierParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // untuk komsumsi API setelah hosting

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/statistics', statisticsRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
}); 