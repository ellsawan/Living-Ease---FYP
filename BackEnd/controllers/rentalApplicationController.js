// controllers/rentalApplicationController.js
const RentalApplication = require('../models/RentalApplication');

// Submit rental application
exports.submitRentalApplication = async (req, res) => {
  try {
    const rentalApplication = new RentalApplication(req.body); // Assuming data comes from frontend as JSON
    const savedApplication = await rentalApplication.save();
    res.status(201).json({ message: 'Rental application submitted successfully!', application: savedApplication });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit rental application', error });
  }
};

// Get all rental applications for a landlord
exports.getRentalApplicationsByLandlord = async (req, res) => {
  try {
    const applications = await RentalApplication.find({ landlordId: req.params.landlordId });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve rental applications', error });
  }
};
// Get all rental applications for a tenant
exports.getRentalApplicationsByTenant = async (req, res) => {
  try {
    // Fetch the rental applications for the tenant
    const applications = await RentalApplication.find({ tenantId: req.params.tenantId })
    .populate({ path: 'propertyId', model: 'Property' }) // Optionally populate property details
    .populate({ path: 'landlordId', model: 'User' })// Optionally populate landlord details
    .populate({ path: 'tenantId', model: 'User' }); // Optionally populate landlord details
    // Log the applications found
    console.log('Applications for Tenant ID:', req.params.tenantId, applications);
    
    if (!applications.length) {
      console.log('No rental applications found for Tenant ID:', req.params.tenantId);
      return res.status(404).json({ message: 'No rental applications found for this tenant' });
    }
    
    // Respond with the applications
    res.status(200).json(applications);
    
  } catch (error) {
    // Log the error
    console.error('Error retrieving rental applications for Tenant ID:', req.params.tenantId, error);
    
    // Respond with error message
    res.status(500).json({ message: 'Failed to retrieve rental applications', error });
  }
};


// Approve or reject a rental application
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body; // Extract status and rejectionReason from the request body

    // Prepare the update object
    const update = { status };

    // If the status is 'rejected', include the rejectionReason
    if (status === 'rejected') {
      update.rejectionReason = rejectionReason;
    }

    const updatedApplication = await RentalApplication.findByIdAndUpdate(
      req.params.applicationId,
      update,
      { new: true }
    );

    // Check if the application was found and updated
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application status', error });
  }
};

// Get details of a specific rental application by ID
exports.getRentalApplicationById = async (req, res) => {
  console.log(`Received request for application ID: ${req.params.applicationId}`);

  try {
    const application = await RentalApplication.findById(req.params.applicationId)
    .populate({ path: 'tenantId', model: 'User' })
    .populate({ path: 'landlordId', model: 'User' })
    .populate({ path: 'propertyId', model: 'Property' }); // Populate references if needed
      console.log('Populated Application:', application);
    if (!application) {
      console.log(`No application found for ID: ${req.params.applicationId}`);
      return res.status(404).json({ message: 'Rental application not found' });
    }

    console.log(`Application found: ${JSON.stringify(application)}`);
    res.status(200).json(application);
  } catch (error) {
    console.error('Error retrieving rental application:', error);
    res.status(500).json({ message: 'Failed to retrieve rental application', error });
  }
};
