// Dependencies
const basicAuth   = require('basic-auth');
const logger      = require('../logger');
const sessions    = require('../session');

// Procedures
const groupProc   = require('../procedures/group');

// Models
const Group       = require('../schemas/group');
const Message     = require('../schemas/message');

exports.groupFilter =　function(req, res) {
  logger('Group authentication filter for: ' +　req.originalUrl);
  req.next();
}

exports.newMessage = function(req, res) {
  groupProc.newMessage(req.body.message);
}

exports.getMessages = function(req, res) {
  // var sessionCard = {
  //   sessionId: req.cookies.sessionId,
  //   securityToken: req.cookies.securityToken
  // }
  Group.count({_id: req.params.group, members: sessions.getUserId(req.cookies)}, function(err, result){
    try {
      if (err) {
        throw err;
      }

      if (result === 0) {
        throw 'unauthorized, or invalid group id';
      }

      Message.find({group: req.params.group}, function(err, result) {
        if (err) {
          throw err;
        }
        res.json({success: true, messages: result});
      });

    } catch(err) {
      logger('Error: ' + err);
      res.status(400).json({success: false});
    }
  })
};

exports.createGroup = function(req, res) {
  logger('Group creation request.');
  var sessionCard = {
    sessionId: basicAuth(req).name,
    securityToken: basicAuth(req).pass
  }
  if (sessions.exists(sessionCard)) {

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
    res.json({success: true, newGroup: newGroup});
    logger('Group successfully created.');
  } else {
      res.status(400).json({success: false});
      logger('Group creation failed.');
  }
}
