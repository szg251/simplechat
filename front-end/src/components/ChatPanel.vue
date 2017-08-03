<template>
  <div class="chat-panel">
    <div class="floating-panel-header">
      <a @click="toggleMembers">{{groupName}}</a>
      <ul class="member-list" v-if="isMembersVisible">
        <li>Me</li>
        <li v-for="(member, i) in members" v-if="member != currentUser" :key="'member' + i">
          <router-link :to="'/user/friend/' + member">{{member}}</router-link>
        </li>
        <a class="btn btn-default" href="#">Edit</a>
        <a class="btn btn-danger" @click="deleteGroup">Delete</a>
      </ul>
    </div>
    <div class="floating-panel-body">
      <div class="loading" v-if="isLoading">&nbsp;loading...</div>
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
              placeholder="Write something..." v-model="newMsg">
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
      reachedTop: false,
      isChatVisible: true,
      isMembersVisible: false,
      isLoading: true,
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
      this.panelScrollDown();
    });
    if (this.currentGroup != '') {
      this.getGroupData();
    }
  },
  mounted() {
      document.querySelector('.floating-panel-body').addEventListener('scroll', this.onScroll);
  },
  methods: {
    getGroupData(skip) {
      axios.get(routes.apiRoutes.getGroup(this.currentGroup))
        .then(response => {
          this.groupName = response.data.group.name,
          this.members = response.data.group.members
      });

      this.getMessages(0)
    },
    getMessages(skip, scrollDown) {
      this.isLoading = true;
      axios.get(routes.apiRoutes.getMessages(this.currentGroup), {params: {skip: skip}})
        .then(response => {
          var messages = [];
          for (var result of response.data.messages) {
            messages.push(cryptMsg.decipherMessage(result));
          }
          this.messages = messages.concat(this.messages);
          this.reachedTop = response.data.reachedTop;
          this.panelScrollDown();
          this.isLoading = false;
      })
    },
    addMsg(e) {
      e.preventDefault();
      var newMsg = {
        user: this.currentUser,
        group: this.currentGroup,
        text: this.newMsg,
        time: Date.now()
      }

      this.messages.push(newMsg);
      socket.emit('message from client', cryptMsg.cipherMessage(newMsg));
      this.newMsg = '';
      this.panelScrollDown();
    },
    deleteGroup() {

    },
    toggleChat() {
      this.isChatVisible = !this.isChatVisible;
    },
    toggleMembers() {
      this.isMembersVisible = !this.isMembersVisible;
    },
    panelScrollDown () {
      var chatPanel = document.querySelector('.floating-panel-body');
      var currentHeight = chatPanel.scrollHeight;
      this.$nextTick(function() {
        var height = chatPanel.scrollHeight;
        chatPanel.scrollTop = height - currentHeight;
      })
    },
    onScroll(e) {
      if (e.target.scrollTop == 0 && !this.reachedTop) {
        this.getMessages(this.messages.length);
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .loading {
    text-align: center;
    font-style: italic;
  }
</style>
