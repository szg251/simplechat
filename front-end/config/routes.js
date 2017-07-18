// API routes
const backEndServer = 'http://localhost:3001';

module.exports =　exports = {
  socketRoute: backEndServer,
  apiRoute: backEndServer,
  apiRoutes: {
    login:        backEndServer + '/login',
    signup:       backEndServer + '/signup',
    getUser:      backEndServer + '/user',
    findUser:     backEndServer + '/finduser',
    createGroup:  backEndServer + '/group',
    getGroups:    userId  => {return backEndServer + '/user/' + userId + '/groups'},
    logout:       userId  => {return backEndServer + '/user/' + userId + '/logout'},
    getMessages:  group   => {return backEndServer + '/group/' + group + '/messages'},
    userExists:   userId  => {return backEndServer + '/signup/' + userId}
  }
}
