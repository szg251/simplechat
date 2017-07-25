const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;

const friendSchema = new Schema({
  _userId: {type: String, ref: 'User'},
  connectDate: {type: Date, default: Date.now}
 });

const userSchema = new Schema({
  _id: String,
  pass: String,
  fullname: String,
  introduction: String,
  imageSrc: String,
  friends: [friendSchema],
  createDate: {type: Date, default: Date.now}
});

const User = mongoose.model('user', userSchema);

module.exports = exports = User;
