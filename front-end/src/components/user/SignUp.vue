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
      }
    }
  },
  computed: {
    isEnteredUser: function() {return this.userId != ''},
    isEnteredPass1: function() {return this.password1 != ''},
    isEnteredPass2: function() {return this.password2 != ''}
  },
  methods: {
    checkUserId: function() {
      axios.get(routes.apiRoute + '/user/exists',
          {params: {userId: this.userId}}).then(res => {
            this.idExists = res.data.result;
            })
      this.inputError.user = !this.isEnteredUser || this.idExists;
      // if (!this.inputEntered.user || this.idExists) {
      //   this.inputError.user = true;
      // } else {
      //   this.inputError.user = false;
      // }
    },
    checkPassword1: function() {
      this.isPassInvalid = this.password1 !== this.password2;

    },
    checkPassword2: function() {
      this.isPassInvalid = this.password1 !== this.password2;

    },
    submit: function(e) {
      e.preventDefault();
      if (this.password1 === this.password2
            && axios.get(routes.apiRoute + '/user/exists',
                {params: {userId: this.userId}}))
      {
          axios.post(routes.apiRoute + '/user/signup',
        {params: {
            userId: this.userId,
            password: this.password1
        }})
      }
    }
  }
}
</script>
