<template lang="html">
  <div class="container">
    <h2>Friends</h2>
    <ul>
      <li v-for="(friend, i) in friends" :key="'friend' +　i">{{friend}}</li>
    </ul>
    <h2>Friend requests</h2>
    <ul>
      <li v-for="(friend, i) in friendReqs" :id="'friendReq' + i" :key="'friendReq' +　i">{{friend}}
        <a class="btn btn-default" @click="approveReq">Approve</a>
        <a class="btn btn-default" @click="declineReq">Reject</a>
      </li>
    </ul>
    <h2>Pending requests</h2>
    <ul>
      <li v-for="(friend, i) in pendingReqs" :id="'pendingReq' + i" :key="'pendingReq' +　i">{{friend}}
        <a class="btn btn-default" @click="cancelReq">Cancel</a>
      </li>
    </ul>
    <form>
      <div class="form-group">
        <input class="form-control" type="text" v-model="newFriend">
      </div>
      <input type="submit" class="btn btn-primary" v-on:click="sendFriendRequest">
    </form>
  </div>
  
</template>

<script>
import axios from 'axios'
import routes from '../../../config/routes'

export default {
  name: 'friends',
  data() {
    return {
      newFriend: '',
      friends: [],
      friendReqs: [],
      pendingReqs: []
    }
  },
  props: ['currentUser'],
  created: function () {
    if (this.currentUser != '') {
      this.getUserData();
    }
  },
  watch: { 
    currentUser: function() {
      this.getUserData();
    }
  },
  methods: {
    sendFriendRequest: function(e) {
      e.preventDefault();
      var friendIds = this.newFriend.split(' ');
      
      for (var i = 0; i　< friendIds.length; i++) {
        axios.put(routes.apiRoutes.sendFriendRequest(this.currentUser), {friendId: friendIds[i]}); 
      }
      this.newFriend = '';
    },
    approveReq: function(e) {
      var friendId = this.friendReqs[e.target.parentNode.id.substring(9,10)];
      axios.post(routes.apiRoutes.approveFriendRequest(this.currentUser), {friendId: friendId});
      this.friendReqs.splice(e.target.parentNode.id.substring(9,10), 1);
      this.friends.push(friendId);
    },
    declineReq: function (e) {
      var friendId = this.friendReqs[e.target.parentNode.id.substring(9,10)];
      axios.delete(routes.apiRoutes.declineFriendRequest(this.currentUser), {friendId: friendId});
      this.friendReqs.splice(e.target.parentNode.id.substring(9,10), 1);
      this.friends.push(friendId);      
    },
    cancelReq: function (e) {
      var friendId = this.pendingReqs[e.target.parentNode.id.substring(10,11)];
      axios.delete(routes.apiRoutes.cancelFriendRequest(this.currentUser), {friendId: friendId});
      this.pendingReqs.splice(e.target.parentNode.id.substring(10,11), 1);
      this.friends.push(friendId);      
    },
    getUserData: function() {
      axios.get(routes.apiRoutes.getFriends(this.currentUser))
        .then(results => {
          this.friends = results.data.friends;
        });

      axios.get(routes.apiRoutes.getFriendRequests(this.currentUser))
        .then(results => {
          this.friendReqs = [];
          for (var friendReq of results.data.friendRequests) {
            this.friendReqs.push(friendReq._requester);
          }
        })

      axios.get(routes.apiRoutes.getMyFriendRequests(this.currentUser))
        .then(results => {
          this.pendingReqs = [];
          for (var friendReq of results.data.friendRequests) {
            this.pendingReqs.push(friendReq._requestee);
          }
        })
    }
  }
}
</script>

<style lang="css">
</style>
