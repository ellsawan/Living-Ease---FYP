const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who wrote the review
    required: true,
  },
  ratedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the tenant or landlord being reviewed
    required: true,
  },
  role: {
    type: String,
    enum: ['Tenant', 'Landlord'], // Role of the user being rated
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Rating model
const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;
