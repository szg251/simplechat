var mongoose =　require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  user: String,
  group: String,
  text: String,
  time: String
})

var Message = mongoose.model('message', messageSchema);

/*
function(msgObj) {
  newMsg = Message({
    user: msgObj.user,
    group: msgObj.group,
    text: msgObj.text,
    time: msgObj.time
  });
  newMsg.save(function(err) {
    if (err) {
      throw err;
      return false;
    }
    logger('Message saved to db.');
    return true;
  });
*/

module.exports = Message;
