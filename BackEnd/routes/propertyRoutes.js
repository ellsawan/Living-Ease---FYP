const express = require('express');
const router = express.Router();
const { addProperty, addPropertyController,updateProperty,updatePropertyController,searchProperties,getPropertiesByOwnerController,getPropertyByIdController ,deletePropertyController,getPropertiesByUserController} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
//Route to search properties
router.get('/search', searchProperties);
//Add Property
router.post('/', protect, addProperty, addPropertyController);
//Update Property
router.put('/:propertyId', protect,updateProperty, updatePropertyController);
//Delete Property
router.delete('/:propertyId', protect, deletePropertyController);
// Get properties of current user
router.get('/owner', protect, getPropertiesByUserController);
// Route to get properties by owner's ID
router.get('/properties/owner/:ownerId', getPropertiesByOwnerController);
// Route to get property by ID
router.get('/:propertyId', getPropertyByIdController);

module.exports = router;
