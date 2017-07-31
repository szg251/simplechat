<template>
  <div>
    <div class="nav navbar navbar-inverse">
      <div class="container">
        <div class="navbar-brand">{{title}}</div>
        <ul class="nav navbar-nav">
          <li v-if="isLoggedin"><router-link to="/chat">Chat</router-link></li>
          <li v-if="isLoggedin"><router-link to="/user/friends">Friends</router-link></li>
          <li v-if="isLoggedin"><router-link to="/user/friendrequests">Friend requests</router-link></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li v-if="!isLoggedin"><router-link to="/login">Login</router-link></li>
          <li v-if="!isLoggedin"><router-link to="/signup">Sign up</router-link></li>
          <li v-if="isLoggedin"><router-link to="/user/profile">{{currentUser}}</router-link></li>
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
    },
    authenticateUser: function() {
      axios.get(routes.apiRoutes.authenticateUser)
        .then(response => {
          if (response.data.success) {
            this.currentUser = response.data.userId;
            this.isLoggedin = true;
          } else {
            // var cookies = document.cookie.split(';');
            // document.cookie = '';
            // for (var i = 0; i < cookies.length; i++) {
            //   var eqPos = cookies[i].lastIndexOf('=');
            //   var name = cookies[i].substring(0, eqPos);
            //   if (name !== 'sessionId' && name !== 'securityToken') {
            //     document.cookie += cookies[i];
            //   }

            // }
            if (this.$router.currentRoute.path != '/' 
                && this.$router.currentRoute.path != '/login'
                && this.$router.currentRoute.path != '/signup') {

              this.$router.push('/login');
            }
          }
        });
      
    }
  },
  created: function() {
    this.authenticateUser();
  },
  watch: {
    '$route': function() {
      this.authenticateUser();
    }
  }
}
</script>

<style>
  @import '../bower_components/bootstrap/dist/css/bootstrap.min.css';

  .navbar {
    height: 10vh;
    margin-bottom: 0;
    border-radius: 0;
  }
</style>
