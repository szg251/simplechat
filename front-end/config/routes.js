// API routes
const backend = 'http://127.0.0.1:3001';

module.exports = exports = {
  socketRoute: backend,
  apiRoute: backend,
  apiRoutes: {
    login:                backend + '/login',
    signup:               backend + '/signup',
    userExists:           backend + '/userexists',
    logout:               userId  => backend + '/user/' + userId + '/logout',

    authenticateUser:     backend + '/user',
    getUser:              userId  => backend + '/user/' + userId,
    editUser:             userId  => backend + '/user/' + userId,
    uploadImg:            userId  => backend + '/user/' + userId + '/userimg',
    findUser:             backend + '/finduser',
    findFriends:          userId  => backend + '/user/' + userId + '/friends',
    getFriend:            (userId, friendId)  => backend + '/user/' + userId + '/friend/' + friendId,
    getFriends:           (userId)  => backend + '/user/' + userId + '/friends/all',

    getFriendRequests:    userId  => backend + '/user/' + userId + '/friendreqs',
    getMyFriendRequests:  userId  => backend + '/user/' + userId + '/myfriendreqs',
    sendFriendRequest:    userId  => backend + '/user/' + userId + '/friendreqs',
    deleteFriendRequest:  userId  => backend + '/user/' + userId + '/friendreqs',
    approveFriendRequest: userId  => backend + '/user/' + userId + '/approvefriendreq',
    cancelFriendRequest:  userId  => backend + '/user/' + userId + '/friendreqs',
    declineFriendRequest: userId  => backend + '/user/' + userId + '/declinefriendreq',

    createGroup:          backend + '/group',
    editGroup:            group   => backend + '/group/' + group,
    deleteGroup:          group   => backend + '/group/' + group,
    getGroups:            userId  => backend + '/user/' + userId + '/groups',
    getGroup:             group   => backend + '/group/' + group,
    getMessages:          group   => backend + '/group/' + group + '/messages'
  }
}
