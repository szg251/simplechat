const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;
const User      = require('./user');

const uploadSchema = new Schema({
  src: {type: String, required: true},
  temporary: Boolean,
  owner: {type: String, ref: 'User'},
  createDate: {type: Date, default: Date.now}
});

const Upload = mongoose.model('upload', uploadSchema);

module.exports = exports = Upload;
