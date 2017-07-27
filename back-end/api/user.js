// Dependencies
const logger      = require('../logger');
const sessions    = require('../session');
const crypto      = require('crypto');

// Models
const User        = require('../models/user');
const Upload        = require('../models/upload');
const FriendReq   = require('../models/friendreq')
const Group       = require('../models/group');


function processPass(pass) {
  const secret = 'abcdefg';
  return crypto.createHmac('sha256', secret)
                   .update(pass)
                   .digest('hex');
}

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

exports.authenticateUser =　function(req, res) {
  logger('User information request.');

  var userId = sessions.getUserId(req.cookies);
  if (userId == null) {
      logger('User not logged in.');
      res.status(200).json({success: false, reason: 'User not logged in.'});
      return;
  }

  User.findOne({_id: userId}).exec((err, user) => {
    if (err) {
      logger('Database error: ' + err);
      res.status(500).json({success: false, reason: 'Database error.'});
      return;
    }

    res.json({success: true, userId: user._id});
  })
}

exports.getUser =　function(req, res) {
  logger('User information request.');

  User.findOne({_id: req.params.userId}).exec((err, user) => {
    if (err) {
      logger('Database error: ' + err);
      res.status(400).json({success: false});
    }

    var userInfo =　{
      userId: user._id,
      fullname: user.fullname,
      introduction: user.introduction,
      imageSrc: user.imageSrc
    }
    res.json({success: true, user: userInfo});
  })
}

exports.changeUserInfo =　function(req, res) {
  logger('User info modification request.');

  User.findOne({_id: req.params.userId}).exec((err, user) => {
    if (err) {
      logger('Database error: ' + err);
      res.status(400).json({success: false});
      return;
    }

    if (user.imageSrc != req.body.imageSrc) {

      // Changing the temporary state of the new image to false
      if (req.body.imageSrc != '') {
        Upload.findOne({src: req.body.imageSrc})
        .exec((err, newImg) => {
          if (err) {
            logger('Database error: ' + err);
            res.status(500).json({success: false, reason: 'Database error.'});
            return;
          }

          if (newImg == null) {
            logger('Image source is not in the database.');
            res.status(500).json({success: false, reason: 'Image upload failed.'});
            return;
          }

          newImg.temporary = false;
          newImg.save();
        })
      }


      // Changing the temporary state of the old image to true
      if (user.imageSrc != '') {
        Upload.findOne({src: user.imageSrc}).exec((err, oldImg) => {
          oldImg.temporary = true;
          oldImg.save();
        })
      }
    }

    user.fullname = req.body.fullname;
    user.imageSrc = req.body.imageSrc;
    user.introduction = req.body.introduction;
    user.save(err => {
      if (err) {
        logger('Database error: ' + err);
        res.status(400).json({success: false});
        return;
      }

      res.status(200).json({success: true});
    })
  })
}

exports.getFriend =　function(req, res) {
  logger('Friend information request.');

// left join ($lookup) is not working in the current version of MongoDB (v2.6)
  User.aggregate(
    {$match: {_id: req.params.friendId}},
    {$unwind: '$friends'},
    {$match: {"friends._userId": req.params.userId}},
    {$project: {
      _id: 1,
      fullname: "$fullname",
      introduction: "$introduction",
      imageSrc: "$imageSrc"
    }} ).exec((err, user) => {

      if (err) {
        logger('Database error: ' + err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      }

      if (user.length === 0) {
        logger('Friend not found');
        res.status(400).json({success: false, reason: 'Friend not found.'});
        return;
      }

      res.json({success: true, friend: user[0]});
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
    pass: processPass(req.body.password)
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
      pass: processPass(req.body.password)
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

exports.uploadUserImg = function(req, res) {
  logger('Upload user image requested');

  if (req.file == null) {
      logger('Database error: ' + err);
      res.status(400).json({success: false, reason: 'No file'});
      return;
  }

  var newUpload = new Upload({
    src: 'http://localhost:3001/uploads/' + req.file.filename,
    temporary: true,
    owner: req.params.userId
  });

  newUpload.save((err) => {
    if (err) {
      logger('Database error: ' + err);
      res.status(500).json({success: false, reason: 'Database error.'});
      return;
    }

    res.status(200).json({success: true, path: newUpload.src});
  });
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
    {$match: {'friends._userId': req.params.userId}},
    {$project: {_id: 1, fullname: 1, imageSrc: 1}}
  ]).exec((err, friends) => {

      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false});
        return;
      }

      res.status(200).json({success: true, friends: friends});
    })
}


exports.findFriends = function(req, res) {
  logger('Get friends request by ' + sessions.getUserId(req.cookies));

  User.aggregate([
    {$match: {_id: req.params.userId}},
    {$unwind: '$friends'},
    {$match: {'friends._userId': new RegExp(req.query.friendId, 'i')}},
    {$project: {_id: "$friends._userId"}}
  ]).exec((err, results) => {

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

  FriendReq.find({_requestee: req.params.userId})
    .exec((err, friendReqs) => {
      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false});
        return;
      };

      res.status(200).json({success: true, friendRequests: friendReqs});
    });
}


exports.getMyFriendRequests = function(req, res) {
  logger('Get my friend requests requested by ' + sessions.getUserId(req.cookies));

  FriendReq.find({_requester: req.params.userId})
    .exec((err, friendReqs) => {
      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false});
        return;
      };

      res.status(200).json({success: true, friendRequests: friendReqs});
    });
}

exports.sendFriendRequest = function(req, res) {
  logger('Send friend request requested by ' +　sessions.getUserId(req.cookies));

  // Check if user exists
  User.findOne({_id: req.body.friendId})
    .exec((err, user) => {
      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      };

      if (user == null) {
        res.status(400).json({status: false, reason: 'Friend doesn\'t exist.'})
        return;
      }

      // check if user if friend already
      var alreadyFriend = false;
      for (var i = 0; i < user.friends.length; i++) {
        if (user.friends[i]._userId == req.params.userId) {
          alreadyFriend = true;
          break;
        }
      }

      if (alreadyFriend) {
        res.status(400).json({success: false, reason: 'This user is already your friend.'});
        return;
      }

      // Looking for existing request
      FriendReq.count({_requester: req.params.userId, _requestee: req.body.friendId})
        .exec((err, friendReqCount) => {
        if (err) {
          res.status(500).json({success: false, reason: 'Database error.'});
          return;
        }

        if (friendReqCount !== 0) {
          res.status(400).json({success: false, reason: 'Friend request by this user already exists.'});
          return;
        }
        var newRequest = new FriendReq({
          _requester: req.params.userId,
          _requestee: req.body.friendId
        });
        newRequest.save(err => {
          if (err) {
            res.status(500).json({success: false, reason: 'Database error.'});
          } else {
            res.status(200).json({
              success: true,
              requester: req.params.userId,
              requestee: req.body.friendId
            });
          }
        });
    });
  });
}

exports.approveFriendRequest = function(req, res) {
  logger('Friend request approve requested by ' + sessions.getUserId(req.cookies));

  FriendReq.findOneAndRemove({_requester: req.body.friendId, _requestee: req.params.userId})
    .exec((err, friendReq) => {

      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      };

      if (friendReq == null) {
        res.status(400).json({success: false, reason: 'Friend request doesn\'t exists.'});
        return;
      }

      User.findOne({_id: req.body.friendId}).exec((err, friend) => {
        if (err) {
          logger('Database error: ' +　err);
          // res.status(500).json({success: false, reason: 'Database error.'});
          return;
        };
        User.findOne({_id: req.params.userId}).exec((err, user) => {
        if (err) {
          logger('Database error: ' +　err);
          // res.status(500).json({success: false, reason: 'Database error.'});
          return;
        };

        user.friends.push({_userId: req.body.friendId});
        user.save();

        friend.friends.push({_userId: req.params.userId});
        friend.save();

        res.status(200).json({success: true});
      });
    });
    });
}

exports.cancelFriendRequest = function(req, res) {
  logger('Cancel friend request requested by ' + sessions.getUserId(req.cookies));

  FriendReq.findOneAndRemove({_requester: req.params.userId, _requestee: req.body.friendId})
    .exec((err, friend) => {
      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      };

      res.status(200).json({success: true});
  });

};

// TODO rename to reject
exports.declineFriendRequest = function(req, res) {
  logger('Decline friend request requested by ' + sessions.getUserId(req.cookies));
  console.log(req.params.userId)
  console.log(req.body.friendId)

  FriendReq.findOneAndRemove({_requester: req.body.friendId, _requestee: req.params.userId})
    .exec((err, friend) => {
      if (err) {
        logger('Database error: ' +　err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      };

      if (friend == null) {
        logger('Database error: ' +　err);
        res.status(400).json({success: false, reason: 'Friend request doesn/t exist.'});
        return;
      }

      res.status(200).json({success: true});
  });

};
