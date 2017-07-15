const logger =　require('./logger');

/**
/*  Generate a random id
*/

function randomId() {
  return (Math.random() * 100000).toString(36).substring(0, 10);
}

function Sessions() {
  this.sessions = [];
  this.sessionExpiresIn = 20 * 60000; // 20 minutes
}

function Session(newSession) {
  this.sessionId = newSession.sessionId;
  this.securityToken = newSession.securityToken;
  this.createTime = new Date();
  this.updateTime = new Date();
  this.userId = newSession.userId;
  this.storage = {};

  this.getSessionCard = function() {
    return {
      sessionId: this.sessionId,
      securityToken: this.securityToken
    }
  }
}

/**
/*  Create a new session (returns sessionObject )
**/
Sessions.prototype.createSession =　function(userId) {
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
  var session = new Session({
    sessionId: sessionId,
    securityToken: randomId(),
    userId: userId,
  })

  this.sessions.push(session);
  logger('Session created for ' + userId + ': ' + sessionId);

  // Invalidate session when expired
  function invalidateSession() {
    // Computing the remaining time before expiry
    var updateTimeDiff = (session.updateTime.getTime() + this.sessionExpiresIn) - (new Date().getTime());

    // If no time remains, invalidate, else put on waiting list
    if (updateTimeDiff < 0) {
      this.sessions.splice(this.sessions.indexOf(session), 1);
      logger('Session expired: ' + sessionId);
    } else {
      setTimeout(invalidateSession.bind(this), updateTimeDiff + 1000);
    }
  }

  setTimeout(invalidateSession.bind(this), this.sessionExpiresIn + 1000);

  return session.getSessionCard();
};

Sessions.prototype.getByUserId = function(userId) {
  for (var session of this.sessions) {
    if (session.userId === userId){
      session.updateTime = new Date();
      return session.getSessionCard();
    };
  }
  return false;
}

Sessions.prototype.getUserId =　function(sessionData) {
  for(var session of this.sessions){
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        session.updateTime = new Date();
        return session.userId;
      }
  }
  return false;
}

Sessions.prototype.isExists = function(sessionData) {
  for (var session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        session.updateTime = new Date();
        return true;;
      }
  }
  return false;
}

/**
/*  Set data to session (returns true on success)
**/
Sessions.prototype.pushData = function(sessionData, data) {
  for (var session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        session.storage[data.key] = data.data;
        session.updateTime = new Date();
        return true;
      }
  }
  return false;
}

/**
/* Get data from session
*/
Sessions.prototype.pullData = function(sessionData, key) {
  for (session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        session.updateTime = new Date();
        return session.storage[key];
      }
  }
  return false;
}

/**
/*  Delete data from session
**/
Sessions.prototype.dropData = function(sessionData, key) {
  for (var session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        delete session.storage[key];
        session.updateTime = new Date();
        return true;
      }
  }
  return false;
}

/**
/*  Invalidate session (returns true on success)
**/
Sessions.prototype.destroy = function(data) {
  for (var session of this.sessions) {
    if (session.sessionId === data.sessionId
      && session.securityToken === data.securityToken)
      {
        this.sessions.splice(this.sessions.indexOf(session), 1);
        return true;
      }
  }
  return false;
}

module.exports = exports = new Sessions();
