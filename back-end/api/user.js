// Dependencies
const basicAuth   = require('basic-auth');
const logger      = require('../logger');
const sessions    = require('../session');

// Models
const User        = require('../schemas/user');
const Group        = require('../schemas/group');

/**
  * Checking if userId already exists (mostly before signup)
  */
exports.idExists = function(req, res) {
  User.count({_id: req.params.userId}, function(err, result) {
    if (err) {
      res.status(500).end();
      return;
    }
    var userIdExists = (result != 0);

    res.json({userIdExists: userIdExists});
  })
}

exports.getUser =　function(req, res) {
  logger('User information request.');

  User.findOne({_id: sessions.getUserId(req.cookies)}, function(err, user) {
    try {
      if (err) {
        throw err;
      }

      var userInfo =　{
        userId: user._id
      }
      res.json({success: true, userInfo: userInfo});

    } catch(err) {
      logger('Database error: ' + err);
      res.status(400).json({success: false});
    }
  })
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

  if (sessionCard !== undefined) {
    res
      .cookie('sessionId', sessionCard.sessionId, {expire: sessionCard.expireTime})
      .cookie('securityToken', sessionCard.securityToken, {expire: sessionCard.expireTime})
      .status(200)
      .json({success: true, authCard: sessionCard});
    logger('Login successful.');
    return;
  }

  // Otherwise, get from database
  User.findOne({
    _id: req.body.userId,
    passwordHash: req.body.password
  }, function(err, result) {

    if (err == null && result !== null) {
      sessionCard = sessions.createSession(req.body.userId);
      res
        .cookie('sessionId', sessionCard.sessionId, {expire: sessionCard.expireTime})
        .cookie('securityToken', sessionCard.securityToken, {expire: sessionCard.expireTime})
        .status(200)
        .json({success: true, authCard: sessionCard});
      logger('Login successful.');
    } else {
      res.status(400).json({success: false});
      logger('Login failed.');
    }

  });
};

exports.logout = function(req, res) {
  logger('Logout request by ' +　req.params.userId);
  if (sessions.getUserId(req.cookies) != null
    && req.params.userId === sessions.getUserId(req.cookies)) {
    sessions.destroy(req.cookies);
    res
      .status(200)
      .clearCookie('sessionId')
      .clearCookie('securityToken')
      .json({userLogout: true});
      logger('Logged out');
  } else {
    res.status(400).json({userLogout: false});
    logger('Logout failed.');
  }
}

/**
 *  Sign up procedure
 */
exports.signUp = function(req, res) {
  logger('Signup request by ' + req.body.userId);

  if (req.body.userId === null || req.body.userId === ''
      ||　req.body.password === null || req.body.password === '') {

    res.status(400).json({success: false});
    logger('Sign up failed.');
    return;
  }

  User.count({_id: req.body.userId}, function(err, result) {
    if (err) {
      logger('Database error: ' +　err)
      res.status(500).json({success: false});
      return;
    }
    // checking if userId exists
    if (result !== 0) {
      res.status(400).json({success: false, reason: 'UserId already exists.'});
      logger('Sign up failed.');
      return;
    }
    var newUser = new User({
      _id: req.body.userId,
      passwordHash: req.body.password
    });
    newUser.save(err);

    if (err) {
      res.status(500).json({success: false, reason: 'Database error'});
      logger('Database error: ' +　err);
      return;
    }

    // creating a session with userId and sending token cookie
    var sessionCard = sessions.createSession(req.body.userId);
    res
      .cookie('sessionId', sessionCard.sessionId, {expire: sessionCard.expireTime})
      .cookie('securityToken', sessionCard.securityToken, {expire: sessionCard.expireTime})
      .status(200)
      .json({success: true, authCard: sessionCard});
    logger('Sign up successful.');
  })
}

/**
 *  Get groups of a user
 */
exports.getGroups =　function(req, res) {
  logger('Get groups request by ' + sessions.getUserId(req.cookies));

  Group.find({members: req.params.userId}, function(err, groups) {
    if (err) {
      logger('Database error: ' + err);
      res.status(500).json({success: false});
    }
    res.json({success: true, groups: groups});
    logger('Get groups request successful.');
  })
}

exports.findUser = function(req, res) {
  logger('Find userId request by ' + sessions.getUserId(req.cookies));

  User.find({_id: req.params.userId}, function(result) {
      res.status(200).json({success: true, userIds: result});
    })
}
