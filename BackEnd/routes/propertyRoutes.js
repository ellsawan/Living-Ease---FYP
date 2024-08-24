const express = require('express');
const router = express.Router();
const { addProperty, addPropertyController } = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/addproperty', protect, addProperty, addPropertyController);

module.exports = router;