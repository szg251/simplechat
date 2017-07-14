const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const logger      = require('./logger');
const basicAuth   = require('basic-auth');

const mongoose    = require('mongoose');
const Message     = require('./schemas/message');
const User        = require('./schemas/user');
const socketio    = require('socket.io');
const Sessions    = require('./session');
const sessions    = new Sessions();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB connection
mongoose.connect('mongodb://localhost/vueapp', { useMongoClient: true });
var db = mongoose.connection;

db.once('open', function() {
  logger('Mongoose connected');
})
db.on('error', function(err) {
  logger('Database error: ' + err);
});

// Routing


// '/messages/:group'
app.get('/messages', function(req, res) {
  Message.find({group: req.query.group}, function(err, result) {
    if (err) {
      throw err;
      return false;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
});

app.get('/user/exists/:userId', function(req, res) {
  User.count({userId: req.params.userId}, function(err, result) {
    if (err) {
      throw err;
      return false;
    }
    var userIdExists = (result != 0);

    res.header("Access-Control-Allow-Origin", "*");
    res.json({userIdExists: userIdExists});
  });
});

app.post('/user/login', function(req, res) {
  logger('Login request by user: ' + req.body.userId);
  var sessionCard;

  sessionCard = sessions.getByUserId(req.body.userId);

 if (sessionCard == undefined) {
   User.findOne({
      userId: req.body.userId,
      passwordHash: req.body.password
    }, function(err, result) {
      if (result !== null) {

        // creating a session with userId (ISSUE: cannot see it in response)
        sessionCard = sessions.createSession(req.body.userId);
      }
    });
  }
  if (sessionCard !== undefined) {
    res.status(200).json({authCard: sessionCard});
  } else {
    res.status(400).end();
  }
});

app.post('/user/signup', function(req, res) {
  logger('Signup request.');

  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.userId != null && req.body.userId != ''
      &&　req.body.password != null && req.body.password != '') {

    User.count({userId: req.body.userId}, function(err, result) {
      if (err) {
        throw err;
        return false;
      }
      if (result === 0 && req.query.password !== '') {
        var newUser = new User({
          userId: req.body.userId,
          passwordHash: req.body.password
        });
        newUser.save();

        // creating a session with userId
        var sessionCard = sessions.createSession(req.query.userId);
        res.status(200).json({authCard: sessionCard});
      } else {
        res.status(400).end();
      };
    });
  } else {
    res.status(400).end();
  }
});

app.get('/user/auth', function(req, res) {
  var sessionData = {
    sessionId: basicAuth(req).name,
    securityToken: basicAuth(req).pass
  }
  var userId = sessions.pullData(sessionData, 'user');
  var group = sessions.pullData(sessionData, 'group');
  res.json({
    user: userId,
    group : group
  });
})

const server = app.listen('3001');
const io = socketio(server);
require('./socket-start')(io)

// var sessionCard = sessions.createSession();
// sessions.pushData(sessionCard, {key: 'user', data: 'Gergo'});
// sessions.pushData(sessionCard, {key: 'group', data: 'NG'});

// var sessionCard = sessions.createSession();
// setTimeout(function() {sessions.pushData(sessionCard, {key: 'key', data: 'data'})}, 4000);
// getData();
// setTimeout(getData, 7000)
//
// function getData() {
//   console.log(sessions.pullData(sessionCard, 'key'));
// }
