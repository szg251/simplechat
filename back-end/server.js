// Dependencies
const express       = require('express');
const bodyParser    = require('body-parser');
const logger        = require('./logger');
const basicAuth     = require('basic-auth');
const mongoose      = require('mongoose');
const socketio      = require('socket.io');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');

// API functions
const filters       = require('./api/filters');
const userApi       = require('./api/user');
const groupApi      = require('./api/group');

logger('Vueapp back-end server booting...');

const app           = express();

app.use(cors({credentials: true, origin: 'http://localhost:3333'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
app.all('/user*', filters.userFilter);
app.all('/group*', filters.userFilter);
app.all('/user/:userId*', filters.userParamFilter);
app.all('/group/:group*', filters.groupFilter);

// User API
app.post('/login', userApi.login);
app.post('/signup', userApi.signUp);
app.get('/user', userApi.getUser);
app.get('/user/:userId/logout', userApi.logout);
app.get('/user/:userId/groups', userApi.getGroups);
app.get('/signup/:userId', userApi.idExists); // not filtered
app.get('/finduser', userApi.findUser);

// Group API
app.get('/group/:group/messages', groupApi.getMessages);
app.put('/group/:group/messages', groupApi.newMessage);
app.put('/group', groupApi.createGroup);

const server = app.listen('3001');
const io = socketio(server);
require('./socket-start')(io)
