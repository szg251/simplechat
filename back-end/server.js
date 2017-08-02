// Dependencies
const express       = require('express');
const bodyParser    = require('body-parser');
const logger        = require('./logger');
const mongoose      = require('mongoose');
const socketio      = require('socket.io');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');
const multer        = require('multer');

// API functions
const filters       = require('./api/filters');
const userApi       = require('./api/user');
const groupApi      = require('./api/group');

logger('Vueapp back-end server booting...');

const app           = express();
const storage       = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'static/uploads/');
  },
  filename: function(req, file, cb) {
    const dotIndex = file.originalname.lastIndexOf('.');
    const fileExt = file.originalname.substring(dotIndex + 1, file.originalname.length);
    cb(null, 'user_' + Date.now() + '.' + fileExt);
  }
})
const upload        = multer({storage: storage});


app.use(cors({credentials: true, origin: 'http://localhost:3333'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('static'));

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

//Filters
app.all('*', filters.loggerFilter);

app.all('/group*', filters.userFilter);
app.all('/user/:userId*', filters.userParamFilter);
app.all('/group/:group*', filters.groupFilter);

// User API
app.post('/login', userApi.login);
app.post('/signup', userApi.signUp);
app.put('/user/:userId/userimg', upload.single('userImg'), userApi.uploadUserImg);

app.get('/user', userApi.authenticateUser);
app.get('/user/:userId', userApi.getUser);
app.post('/user/:userId', userApi.changeUserInfo);
app.get('/user/:userId/friends', userApi.findFriends);
app.get('/user/:userId/friend/:friendId', userApi.getFriend);
app.get('/user/:userId/friends/all', userApi.getFriends);

app.get('/user/:userId/friendreqs', userApi.getFriendRequests);
app.get('/user/:userId/myfriendreqs', userApi.getMyFriendRequests);
app.put('/user/:userId/friendreqs', userApi.sendFriendRequest);
app.delete('/user/:userId/friendreqs', userApi.cancelFriendRequest);
app.delete('/user/:userId/declinefriendreq', userApi.declineFriendRequest);
app.post('/user/:userId/approvefriendreq', userApi.approveFriendRequest);

app.get('/user/:userId/logout', userApi.logout);
app.get('/user/:userId/groups', userApi.getGroups);
app.post('/userexists', userApi.userExists);
app.get('/finduser', userApi.findUser);

// Group API
app.get('/group/:group', groupApi.getGroup);
app.get('/group/:group/messages', groupApi.getMessages);
app.put('/group/:group/messages', groupApi.newMessage);
app.put('/group', groupApi.createGroup);

const server = app.listen('3001');
const io = socketio(server);
require('./socket-start')(io)
