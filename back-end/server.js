const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const logger      = require('./logger');

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

app.get('/user/exists', function(req, res) {
  User.count({userId: req.query.userId}, function(err, result) {
    if (err) {
      throw err;
      return false;
    }
    var isExists;
    if (result != 0) {
      isExists = true;
    } else {
      isExists =　false;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.json({result: isExists});
  })
})

const server = app.listen('3001');
const io = socketio(server);
require('./socket-start')(io)


// var sessionCard = sessions.createSession();
// setTimeout(function() {sessions.pushData(sessionCard, {key: 'key', data: 'data'})}, 4000);
// getData();
// setTimeout(getData, 7000)
//
// function getData() {
//   console.log(sessions.pullData(sessionCard, 'key'));
// }
