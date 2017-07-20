const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;

const friendSchema = new Schema({
  _userId: {type: String, ref: 'User'},
  connectDate: {type: Date, default: Date.now}
 });

const friendRequestSchema = new Schema({
  _userId: {type: String, ref: 'User'},
  requestDate: {type: Date, default: Date.now}
});

const userSchema = new Schema({
  _id: String,
  passwordHash: String,
  friendReqs: [friendRequestSchema],
  friends: [friendSchema],
  createDate: {type: Date, default: Date.now}
});

const User = mongoose.model('user', userSchema);

module.exports = exports = User;
