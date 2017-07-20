// Dependencies
const logger      = require('../logger');
const sessions    = require('../session');

// Models
const User        = require('../models/user');
const Group        = require('../models/group');

exports.userFilter =　function(req, res) {
  logger('User authentication filter for: ' + req.originalUrl);
  if (req.cookies.sessionId == null || req.cookies.securityToken == null
      || sessions.getUserId(req.cookies) ==　null) {

    res.status(401).json({success: false, reason: 'Unauthorized'});
    logger('Unauthorized');
    return;
  } else {
    req.next();
  }
}

exports.userParamFilter =　function(req, res) {
  logger('User parameter filter for: ' + req.originalUrl);
  if (req.params.userId != null && req.params.userId != sessions.getUserId(req.cookies)) {
   res.status(401).json({success: false, reason: 'Unauthorized'});
   logger('Unauthorized');
 } else {
   req.next();
 }
}


exports.groupFilter =　function(req, res) {
  logger('Group authentication filter for: ' +　req.originalUrl);
  Group.count({_id: req.params.group, members: sessions.getUserId(req.cookies)}, function(err, result){
    if (err) {
      logger('Database error: ' + err);
      res.status(500).json({success: false, reason: 'Database error'});
      return;
    } else if (result === 0) {
      res.status(401).json({success: false, reason: 'Unauthorized'});
      logger('Unauthorized');
    } else {
      req.next();
    }
  });
}
