const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const User      = require('./user');

const messageSchema = new Schema({
  user: {type: String, ref: 'User'},
  group: String,
  text: String,
  time: {type: Date, default: Date.now},
  readBy: [{type: String, ref: 'User'}]
})

const Message = mongoose.model('message', messageSchema);

module.exports = exports = Message;
