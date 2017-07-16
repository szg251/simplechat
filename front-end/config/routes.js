// API routes
var backEndServer = 'http://localhost:3001';

module.exports =　exports = {
  socketRoute: backEndServer,
  apiRoute: backEndServer,
  apiRoutes: {
    login: backEndServer + '/user/login',
    signup: backEndServer + '/user/signup',
    logout: function(userId) {
      return backEndServer + '/user/' + userId + '/logout';
    },
    getUser: backEndServer + '/user',
    getMessages: function(group) {
      return backEndServer + '/messages/' + group;
    },
    userExists: function(userId) {
      return backEndServer + '/user/' + userId + '/exists';
    }
  }
}
