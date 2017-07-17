<template>
  <div>
    <div class="nav navbar navbar-inverse">
      <div class="container">
        <div class="navbar-brand">{{title}}</div>
        <ul class="nav navbar-nav">
          <li v-if="!isLoggedin"><router-link to="/login">Login</router-link></li>
          <li v-if="!isLoggedin"><router-link to="/signup">Sign up</router-link></li>
          <li v-if="isLoggedin"><router-link to="/chat">Chat</router-link></li>
          <li v-if="isLoggedin"><a href="#" v-on:click="logout">Logout</a></li>
        </ul>
      </div>
    </div>
    <router-view :currentUser="currentUser"></router-view>
  </div>
</template>

<script>
var axios   = require('axios')
var routes  = require('../config/routes')
axios.defaults.withCredentials = true;

export default {
  name: 'app',
  data () {
    return {
      title: 'Chat application',
      currentUser: '',
      isLoggedin: false,
    }
  },
  methods: {
    logout: function() {
      axios.get(routes.apiRoutes.logout(this.currentUser));
      this.currentUser =　'';
      this.isLoggedin = false;
      this.$router.push('/');
    }
  },
  created: function() {
    axios.get(routes.apiRoutes.getUser)
      .then(response => {
        this.currentUser = response.data.userInfo.userId;
        this.isLoggedin = true;
      });
  },
  watch: {
    '$route': function() {
      axios.get(routes.apiRoutes.getUser)
        .then(response => {
          this.currentUser = response.data.userInfo.userId;
          this.isLoggedin = true;
        });
    }
  }
}
</script>

<style>
  @import '../bower_components/bootstrap/dist/css/bootstrap.min.css';

  .navbar {
    height: 10vh;
    margin-bottom: 0;
  }
</style>
