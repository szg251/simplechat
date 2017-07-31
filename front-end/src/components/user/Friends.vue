<template lang="html">
  <div>
    <div class="container">
      <h2>Friends</h2>
          <div v-for="(friend, i) in friends" :key="'friend' +　i" class="friend">
            <router-link :to="'/user/friend/' + friend._id">
              <img :src="friend.imageSrc ? friend.imageSrc : noAvatar"
                class="profile-img"><br/>
                {{friend.fullname ? friend.fullname : friend._id}}
            </router-link>
          </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import routes from '../../../config/routes'

export default {
  name: 'friends',
  data() {
    return {
      noAvatar: 'http://localhost:3333/static/noavatarn.png',
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
    sendReq: function(e) {
      e.preventDefault();
      let friendIds = this.newFriend.split(' ');

      for (var i = 0; i　< friendIds.length; i++) {
        axios.put(routes.apiRoutes.sendFriendRequest(this.currentUser), {friendId: friendIds[i]})
          .then(result => {
            if (result.data.success) {
              this.pendingReqs.push(result.data.requestee);
              this.newFriend = '';
            }
          });
      }
    },
    approveReq: function(e) {
      var friendId = this.friendReqs[e.target.parentNode.id.substring(9,10)];
      axios.post(routes.apiRoutes.approveFriendRequest(this.currentUser), {friendId: friendId})
        .then(response => {
          // Get user data on success
          if (response.data.success) {
            this.friendReqs.splice(e.target.parentNode.id.substring(9,10), 1);
            axios.get(routes.apiRoutes.getFriend(this.currentUser, friendId))
              .then(response => {
                this.friends.push(response.data.friend);
              })
          }
      })
    },
    declineReq: function (e) {
      var friendId = this.friendReqs[e.target.parentNode.id.substring(9,10)];
      axios.delete(routes.apiRoutes.declineFriendRequest(this.currentUser), {data: {friendId: friendId}})
        .then(result => {
          if (result.data.success) {
            this.friendReqs.splice(e.target.parentNode.id.substring(9,10), 1);
          }
      })
    },
    cancelReq: function (e) {
      var friendId = this.pendingReqs[e.target.parentNode.id.substring(10,11)];
      axios.delete(routes.apiRoutes.cancelFriendRequest(this.currentUser), {data: {friendId: friendId}})
        .then(result => {
          if (result.data.success) {
            this.pendingReqs.splice(e.target.parentNode.id.substring(10,11), 1);
          }
        })
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

<style lang="scss">

h2 {
  clear: both;
}

.friend {
  text-align: center;
  font-size: 16px;
  font-style: oblique;
  color: black;
  padding: 20px;
  float: left;

  img {
    height: 150px;
    width: 150px;
    border-radius: 20%;
    margin-bottom: 20px;
  }
}

</style>
