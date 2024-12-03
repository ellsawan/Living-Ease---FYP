const mongoose = require('mongoose');

// Define the schema for maintenance requests
const maintenanceRequestSchema = new mongoose.Schema({
tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
},
propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  requestTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  category: {
    type: String,
    enum: [
      'Plumbing',
      'Electrical',
      'Cleaning',
      'Carpentry',
      'Painting',
      'Landscaping',
      'Pest Control',
      'Security Services',
      'Home Appliance Repair',
    ],
    default: 'Plumbing',
  },

  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema
const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

module.exports = MaintenanceRequest;
