const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema({
  propertyCategory: {
    type: String,
    required: true,
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
  amenities: {
    type: [String],
    required: false,
  },
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

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
