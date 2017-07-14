const logger =　require('./logger');

/**
/*  Generate a random id
*/

function randomId() {
  return (Math.random() * 100000).toString(36).substring(0, 10);
}

function Sessions() {
  this.sessions = [];
  this.sessionExpiresIn = 20 * 6000; // 20 minutes
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
  logger('Session created: ' + sessionId);

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
  var sessionCard;
  this.sessions.forEach(session => {
    if (session.userId === userId){
      sessionCard = session.getSessionCard();
      // some kind of break
    };
  });
  return sessionCard;
}

Sessions.prototype.isExists = function(sessionData) {
  var isExists = false;
  this.sessions.forEach(session => {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken)
      {
        isExists = true;
      }
  })
  return isExists
}

/**
/*  Set data to session (returns true on success)
**/
Sessions.prototype.pushData = function(sessionData, data) {
  var success = false;
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
