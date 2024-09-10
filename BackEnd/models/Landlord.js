const mongoose = require('mongoose');

const LandlordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

});

module.exports = mongoose.model('Landlord', LandlordSchema);