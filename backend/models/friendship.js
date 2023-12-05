const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;