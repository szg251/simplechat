const crypto = require('crypto');
const cipherKey = 'temporary';

exports.cipherMessage = function(rawMessage) {
  const cipher = crypto.createCipher('aes192', cipherKey);
  var cipheredMessage = cipher.update(rawMessage.text, 'utf8', 'hex');
  cipheredMessage += cipher.final('hex');

  return {
      user: rawMessage.user,
      group: rawMessage.group,
      text: cipheredMessage,
  };
}

exports.decipherMessage = function(cipheredMessage) {
  const decipher = crypto.createDecipher('aes192', cipherKey);
  var decipheredMessage = decipher.update(cipheredMessage.text, 'hex', 'utf8');
  decipheredMessage += decipher.final('utf8');

  return {
      user: cipheredMessage.user,
      group: cipheredMessage.group,
      text: decipheredMessage,
      time: cipheredMessage.time
  }
}
