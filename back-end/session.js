const logger =　require('./logger');

/**
/*  Generate a random id
*/

function randomId() {
  return (Math.random() * 100000).toString(36).substring(0, 10);
}

function Sessions() {
  this.sessions = [];

};

/**
/*  Create a new session (returns sessionObject )
**/
Sessions.prototype.createSession =　function() {
  // Generate unique ID
  var sessionId = 1;
  var idExists;
  do {
    sessionId = randomId();
    sessionExists = false;
    this.sessions.forEach(session => {
      if (session.sessionId === sessionId) sessionExists = true;
    });
  } while (idExists);

  // Creating new session object
  var session = {
    sessionId: sessionId,
    securityToken: randomId(),
    createTime: new Date(),
    updateTime: new Date(),
    storage: {}
  }

  this.sessions.push(session);
  logger('Session created: ' + sessionId);

  // Invalidate session when expired
  setTimeout(function() {
    this.sessions.splice(this.sessions.indexOf(session), 1);
    logger('Session expired: ' + sessionId);
  }.bind(this), 600000);

  return session;
};

/**
/*  Set data to session (returns true on success)
**/
Sessions.prototype.pushData = function(sessionData, data) {
  var success;
  this.sessions.forEach(session => {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        session.storage[data.key] = data.data;
        success = true;
        session.updateTime = new Date();
      }
  })
  return success;
}

/**
/* Get data from session
*/
Sessions.prototype.pullData = function(sessionData, key) {
  var result;
  this.sessions.forEach(session => {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        result = session.storage[key];
        session.updateTime = new Date();
      }
  })
  return result;
}

/**
/*  Delete data from session
**/
Sessions.prototype.dropData = function(sessionData, key) {
  var success = false;
  this.sessions.forEach(session => {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        delete session.storage[key];
        success = true;
        session.updateTime = new Date();
      }
  })
  return success;
}

/**
/*  Invalidate session (returns true on success)
**/
Sessions.prototype.destroy = function(data) {
  var success = false;
  this.sessions.forEach(session => {
    if (session.sessionId === data.sessionId
      && session.securityToken === data.securityToken)
      {
        this.sessions.splice(this.sessions.indexOf(session), 1);
        success = true;
      }
  })
  return success;
}

module.exports = exports = Sessions;
