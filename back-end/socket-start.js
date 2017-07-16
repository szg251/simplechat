
// Dependencies
const logger    = require('./logger');
const sessions  = require('./session');

// Procedures
const groupProc = require('./procedures/group');

module.exports = exports = SocketStart;

function SocketStart(io) {

  io.sockets.on('connection', onConnect)

  function onConnect(socket) {
    logger('Socket connection request.');
    var valid = sessions.exists({
      sessionId: socket.handshake.query.sessionId,
      securityToken: socket.handshake.query.securityToken
    });
    // if (!valid) {
    //   socket.disconnect(true);
    //   logger('Socket connection request refused.');
    //   return;
    // }
    logger('Socket connected: ' + socket.id);
    socket.on('disconnect', onDisconnect);
    socket.on('message from client', onMsgFromClient);
    socket.on('join group', onJoinGroup);
    socket.on('error', logger);
  }

  function onDisconnect() {
    logger('Socket disconnected: ' + this.id);
  }

// TODO ISSUE cannot reach this function
  function onMsgFromClient(data) {
    logger('Socket message from client.');
    groupProc.newMessage(data);
    this.broadcast.to(data.group).emit('newMsg', data);
  }

  function onJoinGroup(group) {
    this.join(group);
    logger(this.id + ' joined group ' + group);
  }

}
