const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  teamID: { type: String },
  teamName: { type: String },
  strength: { type: Number },
  memberInfo: {
    type: [{
      discordID: { type: String },
      participantName: { type: String }
    }], default: []
  },
  description: { type: String },
  imageCount: { type: Number },
  images: { type: Array, default: [] }
});

module.exports = mongoose.model('Team', teamSchema, 'teams');
