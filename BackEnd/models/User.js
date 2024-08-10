// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
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
});


module.exports = mongoose.model('User', UserSchema);
