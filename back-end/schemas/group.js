const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  _id: String,
  name: String,
  owner: {type: String, ref: 'User'},
  members: [{type: String, ref: 'User'}]
});

var User = mongoose.model('user', userSchema);

module.exports = exports = User;
