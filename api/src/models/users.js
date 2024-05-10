const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    userType: {
      type: String,
      enum: [
        'ADMIN',
        'NUSER' 
      ],
    },
    phoneNo: { type: String, required: true },
    imageUrl: { type: String, required: true },
    // Add other profile fields here (name, bio, phone, etc.)
  });

  module.exports = mongoose.model('User', userSchema);