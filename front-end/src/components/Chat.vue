<template>
  <div class="hello">
    <transition name="slide">
      <div v-if="isChatVisible" class="col-xs-5 col-sm-4 col-md-3 chat-panel">
        <h2>{{currentUser}}</h2>

        <div v-for="message in messages">
          <small>{{message.user}} - {{message.time}}</small>
          <div :class="{msgFromOther: message.user != currentUser}">
            {{message.text}}
          </div>
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
    <transition>
      <button class="chat-btn btn" v-on:click="toggleChat">{{isChatVisible ? '<' : '>'}}</button>
    </transition>
  </div>
</template>

<script>

var axios   = require('axios')
var io      = require('socket.io-client')
var routes  = require('../../config/routes')
var socket;
axios.defaults.withCredentials = true;

export default {
  name: 'chat',
  data () {
    return {
      newMsg: '',
      currentUser: '',
      currentGroup: '5969d2277fd4d37fd60c00ba',
      messages: [],
      isChatVisible: true,
        "sessionId": "1gip.k6d9d",
        "securityToken": "s9p.5pihw5"
    }
  },
  created: function() {

    socket  = io.connect(routes.socketRoute, {query:
          {sessionId: this.sessionId, securityToken: this.securityToken}})

    socket.emit('join group', this.currentGroup);

    socket.on('newMsg', (data) => {
      this.messages.push(data);
    })

    axios.get(routes.apiRoutes.getUser)
      .then(response => {
        this.currentUser = response.data.userInfo.userId;
      })

    axios.get(routes.apiRoutes.getMessages(this.currentGroup),
      {withCredentials: true})
      .then(response => {
        this.messages = response.data;
      })
  },
  methods: {
    addMsg: function (e) {
      e.preventDefault();
      var newMsg = {
        user: this.currentUser,
        group: this.currentGroup,
        text: this.newMsg,
        time: new Date()
      }

      this.messages.push(newMsg);
      socket.emit('message from client', newMsg);
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
  .chat-panel {
    background-color: LightGray;
    height: 90vh;
    overflow-y: scroll;
  }

  .chat-btn {
    height: 90vh;
    color: white;
    font-weight: bold;
    padding: 2px;
  }

  .msgFromOther {
    text-align: right;
    color: DarkBlue;
  }

  .slide-enter-active, .slide-leave-active {
    transition: all .1s
  }
  .slide-enter, .slide-leave-to  {
    width: 0;
  }
</style>
