<template>
  <div class="hello">
    <div class="form-group">
      <button class="btn btn-primary" v-on:click="toggleChat">Show</button>
    </div>
    <transition name="fade">
      <div v-if="isChatVisible" class="col-xs-5 col-sm-4 col-md-3 well">
        <div v-for="message in messages"  :class="{msgFromOther: message.user != currentUser}">
          <h5>{{message.user}}<small>{{message.time}}</small></h5>
          <small>{{message.text}}</small>
          <hr/>
        </div>
        <form>
          <div class="input-group">
              <input class="form-control" type="text"
                placeholder="メッセージを入力してください" v-model="newMsg">
              <span class="input-group-btn">
                <input class="btn btn-primary" type="submit"
                  value="送信" v-on:click="addMsg">
              </span>
          </div>
        </form>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'chat',
  data () {
    return {
      newMsg: '',
      currentUser: 'Gergo',
      messages: [{
        user: 'Natsuko',
        text: 'Szia Gergo!',
        time: new Date().toLocaleString()
      },
      {
        user: 'Gergo',
        text: 'Szevasz!',
        time: new Date().toLocaleString()
      },
      {
        user: 'Natsuko',
        text: 'Mizu?',
        time: new Date().toLocaleString()
      }],
      isChatVisible: false
    }
  },
  methods: {
    addMsg: function (e) {
      e.preventDefault();
      this.messages.push({
        user: this.currentUser,
        text: this.newMsg,
        time: new Date().toLocaleString()
      });
      this.newMsg = '';
    },
    toggleChat: function() {
      this.isChatVisible = !this.isChatVisible;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.msgFromOther {
  text-align: right;
}
.fade-enter {

}
</style>
