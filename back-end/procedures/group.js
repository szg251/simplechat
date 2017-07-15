const logger      = require('../logger');
const sessions    = require('../session');

const Group       = require('../schemas/group');
const Message     = require('../schemas/message');

exports.newMessage = function(message) {
  var message = new Message(data);
  message.save();
}
