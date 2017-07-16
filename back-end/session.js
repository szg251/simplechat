const logger = require('./logger');

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

function Session(newSession, sessionExpiresIn) {
  this.sessionId = newSession.sessionId;
  this.securityToken = newSession.securityToken;
  this.createTime = new Date();
  this.expireTime = new Date(sessionExpiresIn +　Date.now());
  this.userId = newSession.userId;
  this.storage = {};

  this.getSessionCard = function () {
    return {
      sessionId: this.sessionId,
      securityToken: this.securityToken,
      createTime: this.createTime,
      expireTime: this.expireTime
    }
  }

  this.refreshExpireTime = function() {
    this.expireTime = new Date(sessionExpiresIn +　Date.now());
  }
}

/**
/*  Create a new session (returns sessionObject )
**/
Sessions.prototype.createSession = function (userId) {
  // Generate unique ID
  var sessionId = 1;
  var idExists;
  do {
    sessionId = randomId();
    idExists = false;
    this.sessions.forEach(session => {
      if (session.sessionId === sessionId) {
        idExists = true;
      }
    });
  } while (idExists);

  // Creating new session object
  var session = new Session({
    sessionId: sessionId,
    securityToken: randomId(),
    userId: userId
  }, this.sessionExpiresIn);

  this.sessions.push(session);
  logger('Session created for ' + userId + ': ' + sessionId);

  // Invalidate session when expired
  function invalidateSession() {
    // Computing the remaining time before expiry
    var updateTimeDiff = session.expireTime.getTime() - new Date().getTime();

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

Sessions.prototype.getByUserId = function (userId) {
  for (var session of this.sessions) {
    if (session.userId === userId) {
      session.refreshExpireTime();
      return session.getSessionCard();
    };
  }
  return;
}

Sessions.prototype.getUserId = function (sessionData) {
  for (var session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken) {
      session.refreshExpireTime();
      return session.userId;
    }
  }
  return null;
}

Sessions.prototype.exists = function (sessionData) {
  for (var session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken) {
      session.refreshExpireTime();
      return true;;
    }
  }
  return false;
}

/**
/*  Set data to session (returns true on success)
**/
Sessions.prototype.pushData = function (sessionData, data) {
  for (var session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken) {
      session.storage[data.key] = data.data;
      session.refreshExpireTime();
      return true;
    }
  }
  return false;
}

/**
/* Get data from session
*/
Sessions.prototype.pullData = function (sessionData, key) {
  for (session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken) {
      session.refreshExpireTime();
      return session.storage[key];
    }
  }
  return false;
}

/**
/*  Delete data from session
**/
Sessions.prototype.dropData = function (sessionData, key) {
  for (var session of this.sessions) {
    if (session.sessionId === sessionData.sessionId
      && session.securityToken === sessionData.securityToken) {
      delete session.storage[key];
      session.refreshExpireTime();
      return true;
    }
  }
  return false;
}

/**
/*  Invalidate session (returns true on success)
**/
Sessions.prototype.destroy = function (data) {
  for (var session of this.sessions) {
    if (session.sessionId === data.sessionId
      && session.securityToken === data.securityToken) {
      this.sessions.splice(this.sessions.indexOf(session), 1);
      return true;
    }
  }
  return false;
}

module.exports = exports = new Sessions();
