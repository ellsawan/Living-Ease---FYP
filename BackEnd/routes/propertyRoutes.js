const express = require('express');
const router = express.Router();
const { addProperty, addPropertyController,updateProperty,updatePropertyController,searchProperties,getPropertyByIdController ,deletePropertyController,getPropertiesByOwnerController} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
//Route to search properties
router.get('/search', searchProperties);
//Add Property
router.post('/', protect, addProperty, addPropertyController);
//Update Property
router.put('/:propertyId', protect,updateProperty, updatePropertyController);
//Delete Property
router.delete('/:propertyId', protect, deletePropertyController);
// Get properties by owner ID
router.get('/owner', protect, getPropertiesByOwnerController);
// Route to get property by ID
router.get('/:propertyId', getPropertyByIdController);

module.exports = router;
