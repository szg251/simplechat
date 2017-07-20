const logger      = require('../logger');
const sessions    = require('../session');

const User        = require('../models/user');
const Group       = require('../models/group');
const Message     = require('../models/message');

exports.newMessage = function(messageData) {
  var message = new Message(messageData);
  message.save();
}
