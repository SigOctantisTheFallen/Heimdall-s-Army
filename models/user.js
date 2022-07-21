const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {type: String},
  teamID: {type: String, default: undefined},
  participantName: {type: String}
});

module.exports = mongoose.model('User', userSchema, 'users');
