const LeaseAgreement = require('../models/LeaseAgreement');

// Create a new lease agreement
exports.createLeaseAgreement = async (req, res) => {
  try {
    const leaseAgreement = new LeaseAgreement(req.body);
    await leaseAgreement.save();
    res.status(201).json(leaseAgreement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating lease agreement', error });
  }
};

// Get all lease agreements
exports.getAllLeaseAgreements = async (req, res) => {
  try {
    const leaseAgreements = await LeaseAgreement.find().populate('tenantId landlordId propertyId applicationId');
    res.status(200).json(leaseAgreements);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching lease agreements', error });
  }
};

// Get a specific lease agreement by ID
exports.getLeaseAgreementById = async (req, res) => {
  try {
    const leaseAgreement = await LeaseAgreement.findById(req.params.id).populate('tenantId landlordId propertyId applicationId');
    if (!leaseAgreement) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }
    res.status(200).json(leaseAgreement);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching lease agreement', error });
  }
};

// Update a lease agreement
exports.updateLeaseAgreement = async (req, res) => {
  try {
    const updatedLeaseAgreement = await LeaseAgreement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLeaseAgreement) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }
    res.status(200).json(updatedLeaseAgreement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating lease agreement', error });
  }
};

// Delete a lease agreement
exports.deleteLeaseAgreement = async (req, res) => {
  try {
    const leaseAgreement = await LeaseAgreement.findByIdAndDelete(req.params.id);
    if (!leaseAgreement) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }
    res.status(200).json({ message: 'Lease agreement deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting lease agreement', error });
  }
};
// Get lease agreements by tenant ID
exports.getLeaseAgreementsByTenantId = async (req, res) => {
    try {
      const tenantId = req.params.tenantId;
      const leaseAgreements = await LeaseAgreement.find({ tenantId }).populate('tenantId landlordId propertyId applicationId');
      if (!leaseAgreements.length) {
        return res.status(404).json({ message: 'No lease agreements found for this tenant' });
      }
      res.status(200).json(leaseAgreements);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching lease agreements for tenant', error });
    }
  };
  
  // Get lease agreements by landlord ID
  exports.getLeaseAgreementsByLandlordId = async (req, res) => {
    try {
      const landlordId = req.params.landlordId;
      const leaseAgreements = await LeaseAgreement.find({ landlordId }).populate('tenantId landlordId propertyId applicationId');
      if (!leaseAgreements.length) {
        return res.status(404).json({ message: 'No lease agreements found for this landlord' });
      }
      res.status(200).json(leaseAgreements);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching lease agreements for landlord', error });
    }
  };