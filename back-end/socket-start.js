
// Dependencies
const logger    = require('./logger');

// Procedures
const groupProc = require('./procedures/group');

module.exports = exports = SocketStart;

function SocketStart(io) {

  io.sockets.on('connection', onConnect)

  function onConnect(socket) {
    logger('Socket connected: ' + socket.id);
    socket.on('disconnect', onDisconnect);
    socket.on('msgSent', onMsgSent);
    socket.on('joinGroup', onJoinGroup);
  }

  function onDisconnect() {
    logger('Socket disconnected: ' + this.id);
  }

  function onMsgSent(data) {
    groupProc.newMessage(data);
    this.broadcast.to(data.group).emit('newMsg', data);
  }

  function onJoinGroup(data) {
    this.join(data);
    logger(this.id + ' joined group ' + data);
  }

}
