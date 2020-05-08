const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshToken = new Schema({
  userID: String,
  refreshToken: String,
  rdt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('RefreshToken', RefreshToken);
