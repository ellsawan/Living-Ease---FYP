const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getName,
  updateUserProfile,
  getUserData,
} = require('../controllers/userController');

// Route to get user name
router.get('/name', protect, getName);

// Route to update user profile
router.put('/profile/update', protect, updateUserProfile);

// Route to get user data
router.get('/profile', protect, getUserData);

module.exports = router;
