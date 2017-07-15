// Dependencies
const basicAuth   = require('basic-auth');
const logger      = require('../logger');
const sessions    = require('../session');

// Procedures
const groupProc   = require('../procedures/group');

// Models
const Group       = require('../schemas/group');
const Message     = require('../schemas/message');

// exports.printSessions = function(req, res) {
//   res.json(sessions);
// }

exports.newMessage = function(req, res) {
  groupProc.newMessage(req.body.message);
}

exports.getMessages = function(req, res) {
  Message.find({group: req.params.group}, function(err, result) {
    if (err) {
      throw err;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
};

exports.createGroup = function(req, res) {
  logger('Group creation request.');
  var sessionCard = {
    sessionId: basicAuth(req).name,
    securityToken: basicAuth(req).pass
  }
  if (sessions.isExists(sessionCard)) {

    var owner     = sessions.getUserId(sessionCard);
    var members   = [owner].concat(req.body.members);
    var newGroup  =　new Group({
      name: req.body.name,
      owner: owner,
      members: members
    });
    newGroup.save(function(err) {
      logger(err);
    });
    res.json(newGroup);
    logger('Group successfully created.');
  } else {
      res.status(400).end();
      logger('Group creation failed.');
  }
}
