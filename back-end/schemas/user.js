const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: String,
  passwordHash: String
});

const User = mongoose.model('user', userSchema);

module.exports = exports = User;
