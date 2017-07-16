const logger      = require('../logger');
const sessions    = require('../session');

const User        = require('../schemas/user');
const Group       = require('../schemas/group');
const Message     = require('../schemas/message');

exports.newMessage = function(messageData) {
  var message = new Message(messageData);
  message.save();
}
