// Dependencies
const logger        = require('./logger');
const mongoose      = require('mongoose');

// API functions
const userApi       = require('./api/user');
const groupApi      = require('./api/group');

logger('Test script for API functions');

// DB connection
mongoose.connect('mongodb://localhost/vueapp', { useMongoClient: true });
const db = mongoose.connection;

db.once('open', function() {
  logger('MongoDB connected');
})
db.on('error', function(err) {
  logger('Database error: ' + err);
});

/**
 *  Routing
 **/

// User API
// app.post('/login', userApi.login);
// app.post('/signup', userApi.signUp);
// app.get('/user', userApi.getUser);
// app.get('/user/:userId/friends', userApi.getFriends);
// app.get('/user/:userId/friendreqs', userApi.getFriendRequests);
// app.put('/user/:userId/friendreqs', userApi.sendFriendRequest);
// app.get('/user/:userId/logout', userApi.logout);
// app.get('/user/:userId/groups', userApi.getGroups);
// app.get('/signup/:userId', userApi.idExists); // not filtered
// app.get('/finduser', userApi.findUser);

// // Group API
// app.get('/group/:group/messages', groupApi.getMessages);
// app.put('/group/:group/messages', groupApi.newMessage);
// app.put('/group', groupApi.createGroup);


//
//
// Dummy run
//
//
var dummyReq = {
  body: {
    friendId: 'Natsuko'
  },
  params: {
    userId: 'Gergo'
  }
}

function DummyRes() {
  this.statusVar = 0;
  this.status =　function(status) {
    this.statusVar = status;
    return this;
  },
  this.json = function(jsonObj) {
    logger('Dummy run result (' + this.statusVar + ')');
    logger(JSON.stringify(jsonObj));
  } 
}

var dummyRes = new DummyRes();

userApi.sendFriendRequest(dummyReq, dummyRes);
