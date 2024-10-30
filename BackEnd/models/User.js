const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    maxlength: 2048,
  },
  role: {
    type: String,
    enum: ["Tenant", "Landlord", "ServiceProvider"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  profileImage: {
    publicId: { type: String },
    url: { type: String },
  },
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
  stripeAccountId: { // New field for Stripe account ID
    type: String,
    required: false, // It's not required during initial user creation
  },
});

module.exports = mongoose.model("User", UserSchema);
