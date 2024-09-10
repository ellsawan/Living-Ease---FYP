const express = require('express');
const router = express.Router();
const { 
  addFavoriteProperty, 
  getFavoriteProperties, 
  removeFavoriteProperty,
  isFavoriteProperty
} = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');

// Route to add a property to tenant's favorites
router.post('/favorites', protect, addFavoriteProperty);

// Route to get all favorite properties of a tenant
router.get('/favorites', protect, getFavoriteProperties);

// Route to remove a property from tenant's favorites
router.delete('/favorites', protect, removeFavoriteProperty);

// Route to check if a specific property is in favorites
router.get('/favorites/:propertyId', protect, isFavoriteProperty);

module.exports = router;
