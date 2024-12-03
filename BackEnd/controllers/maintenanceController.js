const ServiceProvider = require('../models/ServiceProvider'); // Assuming the model path is correct
const mongoose = require('mongoose');
const User = require('../models/User');  
const Property=require('../models/Property')
const MaintenanceRequest = require('../models/MaintenanceRequest');

// Controller to update the services of a service provider
exports.updateServices = async (req, res) => {

  const { userId, services, firstName, lastName, contactNumber } = req.body; // Expecting the user ID, services, and profile details

  // Validate services input
  if (!services || services.length === 0) {
    return res.status(400).json({ error: 'At least one service must be selected' });
  }

  const validServices = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Carpentry',
    'Painting',
    'Landscaping',
    'Pest Control',
    'Security Services',
    'Home Appliance Repair',
  ];

  // Validate if all selected services are valid
  const isValid = services.every(service => validServices.includes(service));

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid service category selected' });
  }

  try {
    // First, update the user's profile (firstName, lastName, contactNumber)
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, contactNumber },
      { new: true } // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Then, update the service provider's services
    const serviceProvider = await ServiceProvider.findOneAndUpdate(
      { user: userId },
      { services },
      { new: true } // Return the updated document
    );

    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    return res.status(200).json({
      message: 'Profile and services updated successfully',
      data: { user, serviceProvider },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
// Controller to fetch the services of a service provider
exports.getServices = async (req, res) => {
  const { userId } = req.params; // Expecting the user ID as a route parameter

  try {
    // Fetch the service provider by userId
    const serviceProvider = await ServiceProvider.findOne({ user: userId });

    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Fetch the user profile data as well if needed
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the service provider's services and user details
    return res.status(200).json({
      message: 'Service provider services fetched successfully',
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          contactNumber: user.contactNumber,
        },
        services: serviceProvider.services,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Controller for submitting a maintenance request
exports.submitMaintenanceRequest = async (req, res) => {
  try {
    const { tenantId, requestTitle, description, priority, category } = req.body;

    // Check if the tenantId is valid and exists in the database
    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        message: 'Tenant not found. Please provide a valid tenant ID.',
      });
    }

    // Find the property associated with the tenant
    const rentedProperty = await Property.findOne({ rentedBy: tenantId });
    if (!rentedProperty) {
      return res.status(400).json({
        message: 'No property found associated with this tenant.',
      });
    }

    // Get the propertyId from the found property
    const propertyId = rentedProperty._id;

    // Create a new maintenance request document
    const newRequest = new MaintenanceRequest({
      tenantId,
      propertyId, // Associate the propertyId with the maintenance request
      requestTitle,
      description,
      priority,
      category,
    });

    // Save the maintenance request to the database
    await newRequest.save();

    // Respond with a success message and the created request
    res.status(201).json({
      message: 'Maintenance request submitted successfully.',
      request: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error submitting maintenance request.',
      error: error.message,
    });
  }
};


exports.getTenantMaintenanceRequests = async (req, res) => {
  const { tenantId } = req.params; // Get the tenant ID from the route parameters

  try {
    // Check if the tenant exists
    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        message: 'Tenant not found. Please provide a valid tenant ID.',
      });
    }

    // Fetch all maintenance requests for the tenant
    const maintenanceRequests = await MaintenanceRequest.find({ tenantId });

    if (maintenanceRequests.length === 0) {
      return res.status(404).json({
        message: 'No maintenance requests found for this tenant.',
      });
    }

    // Respond with the fetched maintenance requests
    res.status(200).json({
      message: 'Maintenance requests fetched successfully.',
      data: maintenanceRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching maintenance requests.',
      error: error.message,
    });
  }
};
