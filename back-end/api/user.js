// Dependencies
const basicAuth   = require('basic-auth');
const logger      = require('../logger');
const sessions    = require('../session');

// Models
const User        = require('../schemas/user');
const Group        = require('../schemas/group');

// exports.printSessions = function(req, res) {
//   res.json(sessions);
// }

/**
  * Checking if userId already exists (mostly before signup)
  */
exports.idExists = function(req, res) {
  User.count({_id: req.params.userId}, function(err, result) {
    if (err) {
      throw err;
      res.status(500).end();
      return;
    }
    var userIdExists = (result != 0);

    res.header("Access-Control-Allow-Origin", "*");
    res.json({userIdExists: userIdExists});
  })
}

exports.getUser =　function(req, res) {
  var sessionCard = {
    sessionId: basicAuth(req).name,
    securityToken: basicAuth(req).pass
  }

  if (sessions.getUserId(sessionCard) === req.params.userId) {
    User.findOne({_id: req.params.userId}, function(err, user) {
      var userInfo =　{
        userId: _id,
        // ...
      }
      res.json(userInfo);
    })
  } else {
    res.status(400).end();
  }
}

/**
 *  Login procedure.
 *  Looks for credentials in database, if found, create a new session variable
 *  with sessionId and securityToken, and pass them back to user.
 *  Other processes use these session credentials for authentication.
 */
exports.login = function(req, res) {
  logger('Login request by user: ' + req.body.userId);
  // If session exists, simply send it back
  var sessionCard = sessions.getByUserId(req.body.userId);

  if (sessionCard !== false) {
    res.status(200).json({authCard: sessionCard});
    logger('Login successful.');
    return;
  }

  // Get from database
  User.findOne({
    _id: req.body.userId,
    passwordHash: req.body.password
  }, function(err, result) {

    if (result !== null) {
      sessionCard = sessions.createSession(req.body.userId);
      res.status(200).json({authCard: sessionCard});
      logger('Login successful.');
    } else {
      res.status(400).end();
      logger('Login failed.');
    }

  });
};

/**
 *  Sign up procedure
 */
exports.signUp = function(req, res) {
  logger('Signup request by ' + req.body.userId);

  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.userId != null && req.body.userId != ''
      &&　req.body.password != null && req.body.password != '') {

    User.count({userId: req.body.userId}, function(err, result) {
      if (err) {
        throw err;
        return false;
      }
      // checking if userId exists
      if (result === 0) {
        var newUser = new User({
          _id: req.body.userId,
          passwordHash: req.body.password
        });
        newUser.save();

        // creating a session with userId
        var sessionCard = sessions.createSession(req.body.userId);
        res.status(200).json({authCard: sessionCard});
        logger('Sign up successful.');
      } else {
        res.status(400).end();
        logger('Sign up failed.');
      }
    })
  } else {
    res.status(400).end();
    logger('Sign up failed.');
  }
}

/**
 *  Get groups of a user
 */
exports.getGroups =　function(req, res) {
  logger('Get groups request by ' + basicAuth(req).name);
  var sessionCard = {
    sessionId: basicAuth(req).name,
    securityToken: basicAuth(req).pass
  }

  if (sessions.getUserId(sessionCard) === req.params.userId) {
    Group.find({members: req.params.userId}, function(err, groups) {
      res.json(groups);
      logger('Get groups request successful.');
    })
  } else {
    res.status(400).end();
    logger('Get groups request failed.');
  }
}
