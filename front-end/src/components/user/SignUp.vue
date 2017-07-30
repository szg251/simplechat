<template>
  <div class="col-md-4 col-md-offset-4">
    <form>
      <h1>Sign up</h1>

      <div class="form-group">
        <div v-if="inputError.user" class="alert alert-danger">Invalid user ID</div>
        <input class="form-control" type="text"
              name="userId" placeholder="UserID"
              v-model="userId"
              v-on:change="checkUserId">
      </div>

      <div class="form-group">
        <div v-if="inputError.mail" class="alert alert-danger">Invalid e-mail address</div>
        <input class="form-control" type="text"
              name="mail" placeholder="E-mail address"
              v-model="mail"
              v-on:change="checkMail">
      </div>

      <div class="form-group">
        <div v-if="inputError.pass" class="alert alert-danger">Invalid password</div>
        <input class="form-control" type="password"
              name="pass1" placeholder="Password"
              v-model="pass1"
              v-on:change="checkPass1">
      </div>

      <div class="form-group">
        <input class="form-control" type="password"
              name="pass2" placeholder="Confirm password"
              v-model="pass2"
              v-on:change="checkPass2">
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
      pass1: '',
      pass2: '',
      mail: '',
      idExists: false,
      mailExists: false,
      isPassInvalid: false,
      inputError: {
        user: false,
        pass: false,
        mail: false
      },
      isEntered: {
        user: false,
        pass1: false,
        pass2: false,
        mail: false
      }
    }
  },
  methods: {
    checkUserId () {
      this.isEntered.user = true;
      this.inputError.user = !this.userId || this.idExists;

      axios.post(routes.apiRoutes.userExists, {userId: this.userId})
          .then(res => {
            this.idExists = res.data.userExists;
            this.inputError.user = !this.userId || this.idExists;
      })
    },
    checkPass1 () {
      this.inputError.pass = this.isEntered.pass2 && (this.pass1 !== this.pass2) || !this.pass1 ;
      this.isEntered.pass1 =　true;
    },
    checkPass2 () {
      this.inputError.pass = this.isEntered.pass1 && (this.pass1 !== this.pass2) || !this.pass1;
      this.isEntered.pass2 =　true;

    },
    checkMail () {
      this.isEntered.mail = true;
      var mailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      this.inputError.mail = !this.mail || !mailPattern.test(this.mail);

      axios.post(routes.apiRoutes.userExists, {mail: this.mail})
          .then(res => {
            this.mailExists = res.data.userExists;
            this.inputError.mail = !this.mail || this.mailExists;
      })
    },
    submit (e) {
      e.preventDefault();
      if (!this.inputError.user && !this.inputError.pass && !this.inputError.mail
        && this.isEntered.user && this.isEntered.pass1 && this.isEntered.pass2 && this.isEntered.mail) {

        axios.post(routes.apiRoutes.signup, {
          userId: this.userId,
          password: this.pass1,
          mail: this.mail
        }).then(result => {
          this.$router.push('/chat');
        })
       }
    }
  }
}
</script>
