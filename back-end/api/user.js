// Dependencies
const basicAuth   = require('basic-auth');
const logger      = require('../logger');
const sessions    = require('../session');

// Models
const User        = require('../models/user');
const Group        = require('../models/group');

/**
  * Checking if userId already exists (mostly before signup)
  */
exports.idExists = function(req, res) {
  User.count({_id: req.params.userId}, function(err, result) {
    if (err) {
      res.status(500).json({success: false});
      return;
    }
    var userIdExists = (result != 0);

    res.status(200).json({success: true, userIdExists: userIdExists});
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
    newUser.save(function (err) {

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
    });
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
  console.log(req.query);

  User.find({_id: new RegExp(req.query.userId, 'i')}, function(err, results) {
      var userIds = [];
      for (var result of results) {
        userIds.push(result.id);
      }
      res.status(200).json({success: true, userIds: userIds});
    })
}

exports.getFriends = function(req, res) {
  logger('Get friends request by ' + sessions.getUserId(req.cookies));

  User.aggregate([
    {$match: {_id: req.params.userId}},
    {$unwind: '$friends'}, 
    {$match: {'friends._userId': new RegExp(req.query.friendId, 'i')}}, 
    {$group: {_id: "$friends._userId"}}
  ])
    .exec((err, results) => {
      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false});
        return;
      };
      var friends = [];
      for (var result of results) {
        friends.push(result._id);
      }

      res.status(200).json({success: true, friends: friends});
    });
    
}

exports.getFriendRequests = function(req, res) {
  logger('Get friend requests requested by ' + sessions.getUserId(req.cookies));

  User.aggregate([
    {$match: {_id: req.params.userId}},
    {$unwind: '$friendRequests'},
    {$group: {_id: '$friendReqs._userId'}}
  ])
    .exec((err, results) => {
      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false});
        return;
      };
      var friendReqs = [];
      for (var result of results) {
        friendReqs.push(result._id);
      }

      res.status(200).json({success: true, friendRequests: friendReqs});
    });
}

exports.sendFriendRequest = function(req, res) {
  logger('Send friend request requested by ' +　sessions.getUserId(req.cookies));

  User.findOne({_id: req.body.friendId})
    .exec((err, user) => {

      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false});
        return;
      };

      User.aggregate([
        {$match: {_id: req.body.friendId}},
        {$unwind: '$friends'},
        {$match: {'friends._userId': req.params.userId}},
        {$group: {_id: '$friends._userId'}}
      ]).exec((err, result) => {
        if (err || result.length == 0) {
          res.status(500).json({success: false, reason: 'Database error.'});
        }
          var friendReqExists = false;
          for (var friendReq of user.friendReqs) {
            if (friendReq._userId == req.params.userId) {
              friendReqExists = true;
              break;
            }
          }
          if (!friendReqExists) {
            user.friendReqs.push({_userId: req.params.userId});
            user.save(function(err) {
              if (err) {
                res.status(500).json({success: false, reason: 'Database error.'});
              } else {
                res.status(200).json({success: true});
              }  
          });
      } else {
        res.status(400).json({success: false, reason: 'Friend request by this user already exists.'});
      }
    });
    
        });
}

exports.approveFriendRequest = function(req, res) {
  logger('Friend request approve requested by ' + sessions.getUserId(req.cookies));

  User.findOne({_id: req.params.userId})
    .exec((err, user) => {

      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      };

      var friendReqIndex = -1;
      for (var i = 0; i < user.friendReqs.length; i++) {
        if (user.friendReqs[i]._userId == req.body.friendId) {
          friendReqIndex = i;
          break;;
        }
      }
      
      if (friendReqIndex >= 0) {
        user.friends.push({_userId: user.friendReqs[friendReqIndex]._userId});
        user.friendReqs.splice(friendReqIndex, 1);
        user.save();
        res.status(200).json({success: true});
      } else {
        res.status(400).json({success: false, reason: 'Friend request doesn\'t exists.'});
      }

    });
}

exports.cancelFriendRequest = function(req, res) {
  logger('Cancel friend request requested by ' + sessions.getUserId(req.cookies));


}