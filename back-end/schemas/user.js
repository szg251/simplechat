const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
  userId: {type: String, required: true, unique: true},
  passwordHash: String,
  groups: [{type: ObjectId, ref: 'Group'}]
});

const User = mongoose.model('user', userSchema);

module.exports = exports = User;
