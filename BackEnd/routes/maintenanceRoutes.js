const express = require('express');
const router = express.Router();
const { updateServices,getServices,submitMaintenanceRequest ,getTenantMaintenanceRequests} = require('../controllers/maintenanceController'); // Assuming controller path is correct

// Route to update services
router.put('/service-provider/update-services', updateServices);
// Route to get services of a service provider by userId
router.get('/service-provider/:userId/services', getServices);
// Route for submitting a maintenance request
router.post('/submit-maintenance-request', submitMaintenanceRequest);
// Route to fetch all maintenance requests of a tenant
router.get('/tenant/:tenantId/requests', getTenantMaintenanceRequests);
module.exports = router;
