<template>
  <div>
    <h3>{{fullname}}</h3>
    <img :src="imageSrc" alt="">
    <div><strong>UserId:</strong> {{userId}}</div>
    <div><strong>Fullname:</strong> {{fullname}}</div>
    <div><strong>Introduction:</strong> {{introduction}}</div>
  </div>
</template>

<script>
import axios from 'axios'
import routes from '../../../config/routes'

export default {
  name: 'profile',
  data() {
      return {
        userId: '',
        fullname: '',
        introduction: '',
        imageSrc: '',
      }
  },
  props: ['currentUser'],
  created: function () {
    if (this.currentUser != '') {
      this.getUserData();
    }
  },
  methods: {
    getUserData: function() {
      axios.get(routes.apiRoutes.getUser(this.currentUser))
        .then(result => {
          this.userId = result.data.user.userId,
          this.fullname = result.data.user.fullname,
          this.introduction = result.data.user.introduction,
          this.imageSrc = result.data.user.imageSrc
        });
    }
  },
  watch: {
    currentUser: function() {
      this.getUserData();
    }
  }
}
</script>
