const mongoose =　require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user: String,
  group: String,
  text: String,
  time: String
})

const Message = mongoose.model('message', messageSchema);

module.exports = exports = Message;
