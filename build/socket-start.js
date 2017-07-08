
//  Dependencies

var logger = require('./logger');

module.exports = exports = SocketStart;

function SocketStart(io) {

  io.sockets.on('connection', onConnect)

  function onConnect(socket) {
    logger('Connected: ' + socket.id);
    socket.on('disconnect', onDisconnect)
    socket.on('msgSent', onMsgSent)
    socket.on('joinGroup', joinGroup)
  }

  function onDisconnect() {
    logger('Disconnected: ' + this.id);
  }

  function onMsgSent(data) {
    this.broadcast.to(data.group).emit('newMsg', data);
  }

  function joinGroup(data) {
    this.join(data);
    logger(this.id + ' joined group ' + data);
  }

}
