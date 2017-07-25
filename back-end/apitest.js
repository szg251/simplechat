// Dependencies
const logger      = require('./logger');
const mongoose    = require('mongoose');

// API functions
const userApi     = require('./api/user');
const groupApi    = require('./api/group');

const crypto      = require('crypto');

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

function DummyResponse() {
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
var res = new DummyResponse();

//******************************************************************* */

// //Friend request
// var req = {
//   params: {
//     userId: 'Gergo'
//   },
//   body: {
//     friendId: 'Natsuko'
//   }
// }

// userApi.sendFriendRequest(req, res);
// userApi.cancelFriendRequest(req, res);


// // Friend request approval
// var req = {
//   body: {
//     friendId: 'Gergo'
//   },
//   params: {
//     userId: 'Natsuko'
//   }
// }

// userApi.approveFriendRequest(req, res);

// Cancel friend request
// var req = {
//   body: {
//     friendId: 'Natsuko'
//   },
//   params: {
//     userId: 'Gergo'
//   }
// }
// userApi.cancelFriendRequest(req, res);

// // Get frien
// var req = {
//   body: {
//     friendId: 'Natsuko'
//   },
//   params: {
//     userId: 'Gergo'
//   }
// }
// userApi.getFriend(req, res);

// // Get group
// var req = {
//   params: {
//     group: '596c57d82972e57353ffa7e7'
//   }
// }
// groupApi.getGroup(req, res);


const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
console.log(hash);