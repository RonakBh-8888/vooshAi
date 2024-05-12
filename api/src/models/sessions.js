const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
       accessToken : { type: String, required: true, unique: true },
       sessionId : { type: String, required: true, unique: true },
       logoutDT: { type: Date },
	   loginDT: { type: Date },
       userId: { type: mongoose.Types.ObjectId , ref: 'users' },
       logedIn: {type : Boolean, required : true},
       logedOut: {type : Boolean, default:false}
  });

  module.exports = mongoose.model('Session', sessionSchema);