
module.exports = exports = SocketStart;

function SocketStart(io) {

  io.sockets.on('connection', onConnect)

  function onConnect(socket) {
      socket.on('disconnect', onDisconnect),
      socket.on('msgSent', onMsgSent)
  }

  function onDisconnect() {
//    console.log('Disconnected: ' + this.id);
  }

  function onMsgSent(data) {
//    console.log(data.text);
    io.sockets.emit('newMsg', data);
  }

}
