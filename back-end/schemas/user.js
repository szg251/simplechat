const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;

const userSchema = new Schema({
  _id: String,
  passwordHash: String,
  friendRequests: [{
    _userId: {type: String, ref: 'User'},
    requestDate: {type: Date, default: Date.now}
  }],
  friends: [{
    _userId: {type: String, ref: 'User'},
    connectDate: {type: Date, default: Date.now}
  }],
  createDate: {type: Date, default: Date.now}
});

const User = mongoose.model('user', userSchema);

module.exports = exports = User;
