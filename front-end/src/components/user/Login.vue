<template>
<div class="col-md-4 col-md-offset-4">
  <form action="index.html" method="post">
    <h1>Login</h1>
    <div class="form-group">
      <input class="form-control" type="text" name="userId" placeholder="UserID" v-model="userId">
    </div>
    <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password" v-model="password">
    </div>
    <div class="form-group">
      <input type="submit" class="btn btn-primary" value="Login" v-on:click="submit">
    </div>
  </form>
</div>
</template>

<script>
var axios = require('axios')
var routes = require('../../../config/routes')
axios.defaults.withCredentials = true;

export default {
  name: 'login',
  data() {
    return {
      userId: '',
      password: '',
      sessionId: '',
      securityToken: ''
    }
  },
  methods: {
    submit: function(e) {
      e.preventDefault();
      axios.post(routes.apiRoutes.login, {
          userId: this.userId,
          password: this.password
      }).then(result => {
        if (result.data.success)
          this.$router.push('/chat');
      });
    }
  }
}

</script>
