const LeaseAgreement = require('../models/LeaseAgreement');
const Notification= require('../models/Notification');
const Property = require('../models/Property');
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
// Update a lease agreement (handles termination and tenancy end date logic)
exports.updateLeaseAgreement = async (req, res) => {
  const { status, terminationReason, tenancyEndDate } = req.body;

  try {
    const leaseToUpdate = await LeaseAgreement.findById(req.params.id);
    if (!leaseToUpdate) {
      return res.status(404).json({ message: 'Lease agreement not found' });
    }

    // Handle lease termination logic
    if (status === 'Terminated') {
      leaseToUpdate.status = 'Terminated';
      leaseToUpdate.terminationDate = new Date(); // Set the current date as the termination date

      if (terminationReason) {
        leaseToUpdate.terminationReason = terminationReason; // Set termination reason if provided
      }
    }

    // Automatically terminate the lease if the tenancyEndDate has passed and status is still 'Active'
    if (new Date(tenancyEndDate) <= new Date() && leaseToUpdate.status !== 'Terminated') {
      leaseToUpdate.status = 'Terminated';
      leaseToUpdate.terminationDate = leaseToUpdate.terminationDate || new Date(); // Set terminationDate if it's not already set
    }

    // If the status is updated to 'Active', create a notification for the landlord
    if (status === 'Active') {
      const landlordId = leaseToUpdate.landlordId; // Assuming leaseToUpdate has a landlordId field

      // Get the property details from the propertyId in the lease agreement
      const property = await Property.findById(leaseToUpdate.propertyId);
      if (!property) {
        console.error('Property not found');
        return res.status(404).json({ message: 'Property not found' });
      }

      // Create a message with the property name
      const message = `Lease agreement for property ${property.propertyName} has been signed by tenant.`;

      // Create a new notification for the landlord
      const newNotification = new Notification({
        userId: landlordId, // Use the landlordId
        title: 'Lease Agreement Activated',
        description: message,
        timestamp: new Date(),
      });

      // Save the notification
      await newNotification.save();
    }

    // Update other fields if provided in the request body
    Object.assign(leaseToUpdate, req.body);

    // Save the updated lease agreement
    await leaseToUpdate.save();

    res.status(200).json(leaseToUpdate);
  } catch (error) {
    console.error('Error updating lease agreement:', error); // Log the error for better debugging
    res.status(500).json({ message: 'Error updating lease agreement', error: error.message });
  }
};

exports.checkActiveLease = async (req, res) => {
  const { tenantId } = req.params;

  try {
    // Check for an active lease for the given tenantId
    const activeLease = await LeaseAgreement.findOne({ tenantId, status: 'Active' })
      .populate('landlordId'); // Populate the landlordId field with the full landlord details

    if (activeLease) {
      return res.status(200).json({ active: true, lease: activeLease });
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
