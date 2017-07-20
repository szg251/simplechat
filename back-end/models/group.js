const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;
const User      = require('./user');

const groupSchema = new Schema({
  name: String,
  owner: {type: String, ref: 'User'},
  members: [{type: String, ref: 'User'}]
});

var Group = mongoose.model('group', groupSchema);

module.exports = exports = Group;
