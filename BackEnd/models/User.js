// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength:2048,
  },
  role: {
    type: String,
    enum: ['Tenant', 'Landlord', 'ServiceProvider'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  contactNumber: {
    type: String, // You can use String or Number depending on your use case
    required: false, // Set to `true` if you want to make it required
  },
  profileImage: {
    publicId: { type: String },
    url: { type: String },
  },
});


module.exports = mongoose.model('User', UserSchema);
