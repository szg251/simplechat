
// Dependencies
const logger        = require('./logger');
const sessions      = require('./session');
const cookieParser  = require('socket.io-cookie-parser');
const Group         = require('./models/group');
const Message       = require('./models/message');

// Procedures
const groupProc     = require('./procedures/group');

module.exports = exports = SocketStart;

function SocketStart(io) {

  io.use(cookieParser());
  io.sockets.on('connection', onConnect)

  function onConnect(socket) {
    var userId = sessions.getUserId({
      sessionId: socket.request.cookies.sessionId,
      securityToken: socket.request.cookies.securityToken
    });

    logger('Socket connection request by ' + userId);

    if (!userId) {
      logger('Socket connection refused.');
      socket.disconnect();
      return;
    }

    logger('Socket connected: ' + socket.id);
    socket.on('disconnect', onDisconnect);
    socket.on('message from client', onMsgFromClient);
    socket.on('join group', onJoinGroup);
    socket.on('error', logger);
  }

  function onDisconnect() {
    logger('Socket disconnected: ' + this.id);
  }

  function onMsgFromClient(messageData) {
    logger('Socket message from client.');
    var message = new Message({
        user: messageData.user,
        group: messageData.group,
        text: messageData.text,
    });
    message.save();
    this.broadcast.to(messageData.group).emit('newMsg', messageData);
  }

  function onJoinGroup(group) {
    logger('Group authentication filter for socket ' + this.id);
    Group.count({_id: group, members: sessions.getUserId(this.request.cookies)})
      .exec((err, result) => {

      if (err) {
        logger('Database error: ' + err);
        return;
      } else if (result === 0) {
        logger('Unauthorized');
        return;
      }
    });
    this.join(group);
    logger(this.id + ' joined group ' + group);
  }

}
