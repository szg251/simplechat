var mongoose = require('mongoose');
var Message = require('./schemas/message');
var logger = require('./logger');

module.exports = exports = Model;

function Model() {
  mongoose.connect('mongodb://localhost/vueapp', { useMongoClient: true });
  var db = mongoose.connection;
  db.once('open', function() {
    logger('Mongoose connected');
  })
  db.on('error', function(err) {
    logger(err);
  })
}


Model.prototype.getMessages = function() {
  Message.find({},function(err, result) {
    if (err) {
      throw err;
      return false;
    }
    logger('Messages retrieved.');
  })
}

Model.prototype.setMessage = function(msgObj) {
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
}
