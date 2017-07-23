// API routes
const backEndServer = 'http://localhost:3001';

module.exports =　exports = {
  socketRoute: backEndServer,
  apiRoute: backEndServer,
  apiRoutes: {
    login:              backEndServer + '/login',
    signup:             backEndServer + '/signup',
    logout:             userId  => {return backEndServer + '/user/' + userId + '/logout'},

    getUser:            backEndServer + '/user',
    findUser:           backEndServer + '/finduser', 
    getFriends:         userId  => {return backEndServer + '/user/' + userId + '/friends'},

    getFriendRequests:  userId  => {return backEndServer + '/user/' + userId + '/friendreqs'},
    sendFriendRequest:  userId  => {return backEndServer + '/user/' + userId + '/friendreqs'},
    deleteFriendRequest:  userId  => {return backEndServer + '/user/' + userId + '/friendreqs'},
    approveFriendRequest:  userId  => {return backEndServer + '/user/' + userId + '/approvereqs'},
    
    createGroup:        backEndServer + '/group',
    getGroups:          userId  => {return backEndServer + '/user/' + userId + '/groups'},
    getMessages:        group   => {return backEndServer + '/group/' + group + '/messages'},
    userExists:         userId  => {return backEndServer + '/signup/' + userId}
  }
}
