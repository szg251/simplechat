<template>
  <div>
    <h3>{{fullname}}</h3>
    <img :src="imageSrc" alt="">
    <div><strong>UserId:</strong> {{userId}}</div>
    <div><strong>Fullname:</strong> {{fullname}}</div>
    <div><strong>Introduction:</strong> {{introduction}}</div>
    <div>
      <a class="btn btn-default" v-if="!isFriendRequestSent" @click="sendReq">Send friend request</a>
      <a class="btn btn-default" v-else @click="cancelReq">Cancel friend request</a> 
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import routes from '../../../config/routes'

export default {
  name: 'friend-page',
  data() {
      return {
        userId: '',
        fullname: '',
        introduction: '',
        imageSrc: '',
        isFriendRequestSent: false
      }
  },
  props: ['currentUser', 'friendId'],
  created: function () {
    if (this.currentUser != '') {
      this.getFriendData();
    }
  },
  methods: {
    getFriendData: function() {
      axios.get(routes.apiRoutes.getFriend(this.currentUser, this.friendId))
        .then(result => {
          this.userId = result.data.friend._id,
          this.fullname = result.data.friend.fullname,
          this.introduction = result.data.friend.introduction,
          this.imageSrc = result.data.friend.imageSrc
        });
    },
    sendReq: function() {
      axios.put(routes.apiRoutes.sendFriendRequest(this.currentUser), {friendId: this.friendId})
        .then(result => {
          if (result.data.success) {
            this.isFriendRequestSent = true;
          }
        });
      
    },
    cancelReq: function () {
      axios.delete(routes.apiRoutes.cancelFriendRequest(this.currentUser), {data: {friendId: this.friendId}})
        .then(result => {
          if (result.data.success) {
            this.isFriendRequestSent = false;
          }
        })
    }
  },
  watch: {
    currentUser: function() {
      this.getFriendData();
    }
  }
}
</script>
