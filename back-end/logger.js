
module.exports = exports = logger;

function logger(message) {
  var date =　new Date();
  var timestamp = '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '] ';
  console.log(timestamp + message);
}
