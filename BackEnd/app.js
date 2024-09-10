// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes= require('./routes/userRoutes')
const propertyRoutes = require('./routes/propertyRoutes');
const tenantRoutes=require('./routes/tenantRoutes');
const landlordRoutes=require('./routes/landlordRoutes')
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const timeout = require('connect-timeout');

dotenv.config();

const app = express(); // Move this line up here

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());
app.use(timeout('200s'));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/property', propertyRoutes);
app.use ('/api/landlord', landlordRoutes);

app.use('/api/tenant', tenantRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;