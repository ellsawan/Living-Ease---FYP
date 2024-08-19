const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const upload = multer({ dest: './uploads/' });
const propertySchema = new mongoose.Schema({
  propertyCategory: {
    type: String,
    required: true,
    enum: ['house', 'flat', 'upper portion', 'lower portion', 'farm house', 'room', 'guest house', 'villa'],
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  area: {
    type: Number, // In marla
    required: true,
  },
  rentPrice: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    default: 0,
  },
  bathrooms: {
    type: Number,
    default: 0,
  },
  amenities: [
    {
      type: String,
      enum: ['Car Parking', 'Water Supply', 'CCTV camera', 'Separate Electricity Meter', 'Separate Gas Meter'],
    },
  ],
  propertyTitle: {
    type: String,
    required: true,
  },
  propertyDescription: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Image URL
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
