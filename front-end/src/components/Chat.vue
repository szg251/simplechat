<template>
  <div class="chat-panel">
    <div class="chat-panel-header">
      <h4>{{groupName}}</h4>
      <ul>
        <li v-for="(member, i) in members" :key="'member' + i">
          <router-link :to="'/user/friend/' + member">{{member}}</router-link>
        </li>
      </ul>
    </div>
    <div class="chat-panel-body">
      <div v-for="(message, i) in messages" :key="'message' + i"
          :class="{msgFromOther: message.user != currentUser}"  >
        <small>{{message.user}} - {{message.time}}</small>
        <div>{{message.text}}</div>
      </div>

      <form>
        <div class="input-group">
            <input class="form-control" type="text"
              placeholder="Write some message..." v-model="newMsg">
            <span class="input-group-btn">
              <input class="btn btn-primary" type="submit"
                value="Send" v-on:click="addMsg">
            </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import routes from '../../config/routes'
import io from 'socket.io-client'

var socket;
axios.defaults.withCredentials = true;

export default {
  name: 'chat',
  data () {
    return {
      newMsg: '',
      messages: [],
      isChatVisible: true,
      sessionId: '',
      securityToken: '',
      groupName: '',
      members: []
    }
  },
  props: ['currentGroup', 'currentUser'],
  watch: {
    currentGroup: function() {
      this.getGroupData();
    }
  },
  created: function() {

    socket = io.connect(routes.socketRoute, {
      query: {
            sessionId: this.sessionId,
            securityToken: this.securityToken
          }
    })

    socket.emit('join group', this.currentGroup);

    socket.on('newMsg', (data) => {
      this.messages.push(data);
    });
    if (this.currentGroup != '') {
      this.getGroupData();
    }
  },
  methods: {
    getGroupData: function() {
      axios.get(routes.apiRoutes.getGroup(this.currentGroup))
        .then(response => {
          this.groupName = response.data.group.name,
          this.members = response.data.group.members
      });

      axios.get(routes.apiRoutes.getMessages(this.currentGroup))
        .then(response => {
          this.messages = response.data.messages;
      });
    },
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
    border-radius: 10px;
    padding: 10px;
  }
  .chat-panel-body {
    overflow-y: scroll;
  }

  .msgFromOther {
    text-align: right;
    color: DarkBlue;
  }
</style>
