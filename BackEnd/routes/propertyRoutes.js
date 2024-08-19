const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/getproperties', propertyController.getAllProperties);
router.get('/getproperty', propertyController.getPropertyById);
router.post('/addproperties', propertyController.addProperty);
router.put('/updateproperty', propertyController.updateProperty);
router.delete('/deleteproperty', propertyController.deleteProperty);

module.exports = router;
