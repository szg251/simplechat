// API routes
const backEndServer = 'http://localhost:3001';

module.exports =　exports = {
  socketRoute: backEndServer,
  apiRoute: backEndServer,
  apiRoutes: {
    login:              backEndServer + '/login',
    signup:             backEndServer + '/signup',
    logout:             userId  => {return backEndServer + '/user/' + userId + '/logout'},

    authenticateUser:   backEndServer + '/user',
    getUser:            userId  => {return backEndServer + '/user/' + userId},
    findUser:           backEndServer + '/finduser',
    getFriends:         userId  => {return backEndServer + '/user/' + userId + '/friends'},
    getFriend:          (userId, friendId)  => {return backEndServer + '/user/' + userId + '/friend/' + friendId},

    getFriendRequests:    userId  => {return backEndServer + '/user/' + userId + '/friendreqs'},
    getMyFriendRequests:  userId  => {return backEndServer + '/user/' + userId + '/myfriendreqs'},
    sendFriendRequest:    userId  => {return backEndServer + '/user/' + userId + '/friendreqs'},
    deleteFriendRequest:  userId  => {return backEndServer + '/user/' + userId + '/friendreqs'},
    approveFriendRequest: userId  => {return backEndServer + '/user/' + userId + '/approvefriendreq'},
    cancelFriendRequest:  userId  => {return backEndServer + '/user/' + userId + '/friendreqs'},
    declineFriendRequest: userId  => {return backEndServer + '/user/' + userId + '/declinefriendreq'},

    createGroup:        backEndServer + '/group',
    getGroups:          userId  => {return backEndServer + '/user/' + userId + '/groups'},
    getGroup:           group   => {return backEndServer + '/group/' + group},
    getMessages:        group   => {return backEndServer + '/group/' + group + '/messages'},
    userExists:         userId  => {return backEndServer + '/signup/' + userId}
  }
}
