const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  services: {
    type: [String], // Array of strings to store categories
    required: true,
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
    ], // Valid service categories
    default: [],
  },
  location: {
    type: String, // Example: City, State
    required: true,
  },
  availability: [
    {
      day: {
        type: String,
        required: true,
      },
      time: {
        type: String, // Example: "9 AM - 5 PM"
        required: true,
      },
    },
  ],
  ratings: {
    type: Number, // Average rating
    min: 0,
    max: 5,
    default: 0,
  },
  experienceYears: {
    type: Number, // Years of experience
    default: 0,
  },
  assignedRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request', // Reference to maintenance requests
    },
  ],
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);
