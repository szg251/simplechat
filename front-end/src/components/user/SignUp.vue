<template>
  <div class="container">
    <form class="form-horizontal">

      <div class="form-group">
        <div v-if="inputError.user" class="alert alert-danger">User ID invalid</div>
        <input class="form-control" type="text"
              name="userId" placeholder="UserID"
              v-model="userId"
              v-on:change="checkUserId">
      </div>

      <div class="form-group">
        <div v-if="inputError.password" class="alert alert-danger">Password invalid</div>
        <input class="form-control" type="password"
              name="password1" placeholder="Password"
              v-model="password1"
              v-on:change="checkPassword1">
      </div>

      <div class="form-group">
        <input class="form-control" type="password"
              name="password2" placeholder="Password ()"
              v-model="password2"
              v-on:change="checkPassword2">
      </div>

      <div class="form-group">
        <input class="btn btn-primary" type="submit" name="submit" value="Sign up" v-on:click="submit">
      </div>

    </form>
  </div>
</template>

<script>
var axios = require('axios')
var routes = require('../../../config/routes')

export default {
  name: 'signUp',
  data () {
    return {
      userId: '',
      password1: '',
      password2: '',
      idExists: false,
      isPassInvalid: false,
      inputError: {
        user: false,
        password: false
      },
      isEntered: {
        user: false,
        pass1: false,
        pass2: false
      }
    }
  },
  methods: {
    checkUserId: function() {
      this.isEntered.user =　true;
      if (this.userId !== '') {
        axios.get(routes.apiRoute + '/user/exists/' + this.userId)
            .then(res => {
              this.idExists = res.data.userIdExists;
              this.inputError.user = (this.userId === '') || this.idExists;
              })
          } else {
            this.inputError.user = (this.userId === '') || this.idExists;
          }
    },
    checkPassword1: function() {
      this.inputError.password = this.isEntered.pass2 && (this.password1 !== this.password2) || (this.password1 ===　'') ;
      this.isEntered.pass1 =　true;
    },
    checkPassword2: function() {
      this.inputError.password = this.isEntered.pass1 && (this.password1 !== this.password2) || (this.password1 === '');
      this.isEntered.pass2 =　true;

    },
    submit: function(e) {
      e.preventDefault();
      if (!this.inputError.user && !this.inputError.password
        && this.isEntered.user && this.isEntered.pass1 && this.isEntered.pass2) {

        axios.get(routes.apiRoute + '/user/signup', {
          params: {
            userId: this.userId,
            password: this.password1
          }
        })
       }
    }
  }
}
</script>
