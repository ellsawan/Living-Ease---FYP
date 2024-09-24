const express = require('express');
const router = express.Router();
const leaseAgreementController = require('../controllers/leaseAgreementController');

// Create a new lease agreement
router.post('/', leaseAgreementController.createLeaseAgreement);

// Get all lease agreements
router.get('/', leaseAgreementController.getAllLeaseAgreements);

// Get a specific lease agreement by ID
router.get('/:id', leaseAgreementController.getLeaseAgreementById);

// Update a lease agreement by ID
router.put('/:id', leaseAgreementController.updateLeaseAgreement);

// Delete a lease agreement by ID
router.delete('/:id', leaseAgreementController.deleteLeaseAgreement);
// Get lease agreements by tenant ID
router.get('/tenant/:tenantId', leaseAgreementController.getLeaseAgreementsByTenantId);

// Get lease agreements by landlord ID
router.get('/landlord/:landlordId', leaseAgreementController.getLeaseAgreementsByLandlordId);

module.exports = router;
