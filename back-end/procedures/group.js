const logger      = require('../logger');
const sessions    = require('../session');
const crypto      = require('crypto');

const User        = require('../models/user');
const Group       = require('../models/group');
const Message     = require('../models/message');

exports.newMessage = function(messageData) {
  var message = new Message({
      user: messageData.user,
      group: messageData.group,
      text: messageData.text,
  });
  message.save();
}
