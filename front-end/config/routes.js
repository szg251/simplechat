// API routes
const backend = 'http://localhost:3001';

module.exports = exports = {
  socketRoute: backend,
  apiRoute: backend,
  // api: function(routeName, ...args) {
  //   let apiRoutes = {
  //       login:                '/login',
  //       signup:               '/signup',
  //       userExists:           '/userexists',
  //       logout:               '/user/:userId/logout',
  //
  //       authenticateUser:     '/user',
  //       getUser:              '/user/:userId',
  //       editUser:             '/user/:userId',
  //       uploadImg:            '/user/:userId/userimg',
  //       findUser:             '/finduser',
  //       findFriends:          '/user/:userId/friends',
  //       getFriend:            '/user/:userId/friend/:friendId',
  //       getFriends:           '/user/:userId/friends/all',
  //
  //       getFriendRequests:    '/user/:userId/friendreqs',
  //       getMyFriendRequests:  '/user/:userId/myfriendreqs',
  //       sendFriendRequest:    '/user/:userId/friendreqs',
  //       deleteFriendRequest:  '/user/:userId/friendreqs',
  //       approveFriendRequest: '/user/:userId/approvefriendreq',
  //       cancelFriendRequest:  '/user/:userId/friendreqs',
  //       declineFriendRequest: '/user/:userId/declinefriendreq',
  //
  //       createGroup:          '/group',
  //       editGroup:            '/group/:group',
  //       deleteGroup:          '/group/:group',
  //       getGroups:            '/user/:userId/groups',
  //       getGroup:             '/group/:group',
  //       getMessages:          '/group/:group/messages'
  //     }
  //
  //     let paramRe = /:([^\/]*)/g;
  //     let route = routes[routeName];
  //     let result:
  //     let realPath;
  //     while (result = paramRe.exec(route)) {
  //       realPath
  //     }
  //
  // },
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
