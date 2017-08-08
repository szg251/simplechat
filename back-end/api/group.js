// Dependencies
const logger      = require('../logger');
const sessions    = require('../session');
const crypto      = require('crypto');

// Models
const Group       = require('../models/group');
const Message     = require('../models/message');
const User     = require('../models/user');

const cipherKey = 'temporary';


exports.newMessage = function(req, res) {
  var message = new Message({
      user: req.body.message.user,
      group: req.body.message.group,
      text: req.body.message.text,
  });
  message.save();
}

exports.getMessages = function(req, res) {
  var skip  = req.query.skip ? parseInt(req.query.skip) : 0;
  var limit = req.query.limit ? parseInt(req.query.limit) : 10;
  var reachedTop = false;
  Message.aggregate(
    { $match: { group: req.params.group }},
    { $sort: {time: -1}},
    { $skip: skip },
    { $limit: limit },
    { $sort: {time: 1}}
  ).exec((err, messages) => {
    if (err) {
      logger('Database error: ' + err);
      res.status(500).json({success: false});
      return;
    }

    if (messages.length < limit) {
      reachedTop = true;
    }

    res.json({success: true, messages: messages, reachedTop: reachedTop});
  });
};

exports.getGroup = function(req, res) {

  Group.findOne(
    { $and: [ { _id: req.params.group }, {deleteFlag: false} ]
  }).exec((err, result) => {
    if (err) {
      logger('Database error: ' + err);
      res.status(500).json({success: false});
      return;
    }
    res.status(200).json({success: true, group: result});
  });
}

exports.createGroup = function(req, res) {

  User.count({_id: {$in: [].concat(req.body.members)}})
    .exec((err, result) => {
      if (err){
        logger('Database error: ' + err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      }
      if (result != [].concat(req.body.members).length) {
        logger('Invalid userId.');
        res.status(400).json({success: false, reason: 'Invalid userId.'});
        return;
      }

      var owner     = sessions.getUserId(req.cookies);
      var newGroup  =　new Group({
        name: req.body.name,
        owner: owner,
        members: [owner].concat(req.body.members)
      });

      newGroup.save(function(err) {
        if (err) {
          logger('Database error: ' + err);
          res.status(500).json({success: false, reason: 'Database error.'});
          return;
        } else {
          res.json({success: true, newGroup: newGroup});
          logger('Group successfully created.');
        }
      })
    })
}

exports.changeGroup = function(req, res) {

  Group.findOne(
    { $and: [ { _id: req.params.group }, {deleteFlag: false} ]
  }).exec((err, group) => {

    var owner = sessions.getUserId(req.cookies);

    if (group.owner != owner) {
      logger('Unathorized.');
      res.status(400).json({success: false, reason: 'Unathorized'});
      return;
    }

    User.count({_id: {$in: req.body.members}}).exec((err, result) => {

      if (err){
        logger('Database error: ' + err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      }

      if (result != req.body.members.length) {
        logger('Invalid userId.');
        res.status(400).json({success: false, reason: 'Invalid userId.'});
        return;
      }

      group.members = [owner].concat(req.body.members);
      group.name = req.body.name;
      group.save(function(err) {
        if (err) {
          logger('Database error: ' + err);
          res.status(500).json({success: false, reason: 'Database error.'});
          return;
        } else {
          res.json({success: true, group: group});
          logger('Group successfully created.');
        }
      })
    })

  })
}

exports.deleteGroup = function(req, res) {

  Group.findOne({_id: req.params.group}).exec((err, group) => {
    if (err){
      logger('Database error: ' + err);
      res.status(500).json({success: false, reason: 'Database error.'});
      return;
    }

    Message.find({group: req.params.group}).remove().exec(err => {
      if (err){
        logger('Database error: ' + err);
        res.status(500).json({success: false, reason: 'Database error.'});
        return;
      }

      group.deleteFlag = true;
      group.save();
      res.status(200).json({success: true});
    })
  })
}
