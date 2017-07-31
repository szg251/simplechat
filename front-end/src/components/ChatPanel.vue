<template>
  <div class="chat-panel">
    <div class="floating-panel-header">
      <a @click="toggleMembers">{{groupName}}</a>
      <ul class="member-list" v-if="isMembersVisible">
        <li>Me</li>
        <li v-for="(member, i) in members" v-if="member != currentUser" :key="'member' + i">
          <router-link :to="'/user/friend/' + member">{{member}}</router-link>
        </li>
      </ul>
    </div>
    <div class="floating-panel-body">
      <div class="message" v-for="(message, i) in messages" :key="'message' + i"
          :class="{msgFromOther: message.user != currentUser}"  >
        <span class="timestamp">{{message.user}} - {{message.time}}</span>
        <div class="message-body">{{message.text}}</div>
        <br/>
      </div>
    </div>
    <div class="floating-panel-footer">
      <form class="new-msg">
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
import cryptMsg from '../../security'

var socket;
axios.defaults.withCredentials = true;

export default {
  name: 'chat-panel',
  data () {
    return {
      newMsg: '',
      messages: [],
      isChatVisible: true,
      isMembersVisible: false,
      sessionId: '',
      securityToken: '',
      groupName: '',
      members: []
    }
  },
  props: ['currentGroup', 'currentUser'],
  watch: {
    currentGroup() {
      this.getGroupData();
    }
  },
  created() {

    socket = io.connect(routes.socketRoute, {
      query: {
            sessionId: this.sessionId,
            securityToken: this.securityToken
          }
    })

    socket.emit('join group', this.currentGroup);

    socket.on('newMsg', (message) => {
      this.messages.push(cryptMsg.decipherMessage(message));
    });
    if (this.currentGroup != '') {
      this.getGroupData();
    }
  },
  methods: {
    getGroupData() {
      axios.get(routes.apiRoutes.getGroup(this.currentGroup))
        .then(response => {
          this.groupName = response.data.group.name,
          this.members = response.data.group.members
      });

      axios.get(routes.apiRoutes.getMessages(this.currentGroup))
        .then(response => {
          var messages = [];
          for (var result of response.data.messages) {
            messages.push(cryptMsg.decipherMessage(result));
          }
          this.messages = messages;
          // this.panelScrollDown();
      });
    },
    addMsg(e) {
      e.preventDefault();
      var newMsg = {
        user: this.currentUser,
        group: this.currentGroup,
        text: this.newMsg,
        time: new Date()
      }

      this.messages.push(newMsg);
      socket.emit('message from client', cryptMsg.cipherMessage(newMsg));
      this.newMsg = '';
    },
    toggleChat() {
      this.isChatVisible = !this.isChatVisible;
    },
    toggleMembers() {
      this.isMembersVisible = !this.isMembersVisible;
    // },
    // panelScrollDown () {
    //   document.querySelector('.floating-panel-body').scrollHeight();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
