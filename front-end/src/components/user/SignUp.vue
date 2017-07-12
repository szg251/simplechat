<template>
  <div class="container">
    <form class="form-horizontal">

      <div class="form-group">
        <div v-if="idExists" class="alert alert-danger">User ID exists</div>
        <input class="form-control" type="text"
              name="userId" placeholder="UserID"
              v-model="userId"
              v-on:change="checkUserId">
      </div>

      <div class="form-group">
        <div v-if="isPassInvalid" class="alert alert-danger">Password doesn't match</div>
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
      userIdEntered: false,
      pass1Entered: false,
      pass2Entered: false,
      idExists: false,
      isPassInvalid: false
    }
  },
  methods: {
    checkUserId: function() {
      this.userIdEntered = true;
      checkIdExists();
    },
    checkPassword1: function() {
      this.pass1Entered = true;
      checkPasswordIsSame();
    },
    checkPassword2: function() {
      this.pass2Entered = true;
      checkPasswordIsSame();
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

function checkIdExists() {
  axios.get(routes.apiRoute + '/user/exists',
      {params: {userId: this.userId}}).then(res => {
        this.idExists = res.data.result;
        })
}

function checkPasswordIsSame() {
  if (this.password1 !== this.password2){
    this.isPassInvalid = true;
  } else {
    this.isPassInvalid =　false;
  }
}
</script>
