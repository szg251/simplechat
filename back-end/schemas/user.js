var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userId: {type: String, required: true, unique: true},
  passwordHash: String,
  groups: [String]
});

var User = mongoose.model('user', userSchema);

module.exports = exports = User;
