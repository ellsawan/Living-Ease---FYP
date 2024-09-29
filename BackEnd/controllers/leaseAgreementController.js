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
exports.updateLeaseAgreement = async (req, res) => {
  console.log("Incoming request payload:", req.body);
  const { tenantId, propertyId, status } = req.body; // Assuming tenantId, propertyId, and status are passed in the request body

  try {
    // Find the lease agreement being updated
    const leaseToUpdate = await LeaseAgreement.findById(req.params.id);
    if (!leaseToUpdate) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }

    // Update the lease agreement
    const updatedLeaseAgreement = await LeaseAgreement.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If no lease agreement is found to update
    if (!updatedLeaseAgreement) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }

    res.status(200).json(updatedLeaseAgreement);
  } catch (error) {
    // Enhanced error handling
    console.error("Error updating lease agreement:", error.message); // Log specific error message for debugging
    
    // Check if the error is due to a casting issue (like ObjectId casting)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid input data', error: error.message });
    }

    // Handle other possible errors
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.checkActiveLease = async (req, res) => {
  const { tenantId } = req.params;

  try {
    // Check for an active lease for the given tenantId
    const activeLease = await LeaseAgreement.findOne({ tenantId, status: 'Active' });

    if (activeLease) {
      return res.status(200).json({ active: true });
    } else {
      return res.status(200).json({ active: false });
    }
  } catch (error) {
    console.error('Error checking active lease:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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
