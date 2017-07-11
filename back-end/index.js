const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('./logger');
const Message = require('./schemas/message');
const socketio = require('socket.io');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB connection
mongoose.connect('mongodb://localhost/vueapp', { useMongoClient: true });
var db = mongoose.connection;

db.once('open', function() {
  logger('Mongoose connected');
});
db.on('error', function(err) {
  logger('Database error: ' + err);
});

app.get('/messages', function(req, res) {
  Message.find(function(err, result) {
    if (err) {
      throw err;
      return false;
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
});

const server = app.listen('3001');
const io = socketio(server);
require('./socket-start')(io)

var testobject = {
  name: 'testobject',
  value: '1122'
}
