const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;
const User      = require('./user');

const groupSchema = new Schema({
  name: {type: String, required: true},
  owner: {type: String, ref: 'User'},
  members: [{type: String, ref: 'User'}],
  deleteFlag: {type: Boolean, default: false}
});

var Group = mongoose.model('group', groupSchema);

module.exports = exports = Group;
