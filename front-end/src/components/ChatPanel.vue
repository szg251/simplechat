<template>
  <div :class="{'panel-open' : isOpen}">

    <div class="floating-panel-header" @click="toggleChat">
      <span @mouseover="showMembers" @mouseout="hideMembers">{{groupName}}</span>
      <span class="header-btn glyphicon glyphicon-remove" @click="closeChat" />
      <span class="header-btn glyphicon glyphicon-cog" />
      <ul class="member-list" v-if="membersVisible">
        <li>Me</li>
        <li v-for="(member, i) in members" v-if="member != currentUser" :key="'member' + i">
          {{member}}
        </li>
      </ul>
    </div>

    <div class="chat-panel" v-if="isOpen">

      <div class="floating-panel-body">
        <div class="loading" v-if="isLoading">loading...</div>
        <div class="message"
            v-for="(message, i) in messages" :key="'message' + i"
            :class="{msgFromOther: message.user != currentUser}"  >
          <span class="timestamp">{{message.user}} - {{message.time | dateFormatter}}</span>
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
  </div>
</template>

<script>

import axios from 'axios'
import routes from '../../config/routes'
import io from 'socket.io-client'
import cryptMsg from '../../security'
import bus from './eventbus'

var socket;
axios.defaults.withCredentials = true;

export default {
  name: 'chat-panel',
  data () {
    return {
      newMsg: '',
      messages: [],
      reachedTop: false,
      chatVisible: true,
      membersVisible: false,
      isLoading: true,
      sessionId: '',
      securityToken: '',
      groupName: '',
      members: []
    }
  },
  props: ['currentGroup', 'currentUser', 'isOpen'],
  watch: {
    currentGroup() {
      this.getGroupData();
    }
  },
  filters: {
      dateFormatter (value) {
        var date = new Date(value);
        var test = new Date();
        var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        test.setHours(0);
        test.setMinutes(0);
        test.setSeconds(0);

        // today
        if (test < date) {
          return date.getHours() + ':' + date.getMinutes();
        }

        // day of week
        test.setDate(test.getDate() - 6);
        if (test < date) {
          return weekdays[date.getDay()] + " " + date.getHours() + ':' + date.getMinutes();
        }

        return date.toLocaleDateString() + ' ' + date.getHours() + ':' + date.getMinutes();
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

    socket.on('newMsg', message => {
      if (message.group == currentGroup) {
        this.messages.push(cryptMsg.decipherMessage(message));
        this.panelScrollDown();
      }
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
          this.groupName  = response.data.group.name,
          this.members    = response.data.group.members
      });

      this.getMessages(0);
    },
    getMessages(skip) {
      this.isLoading = true;
      axios.get(routes.apiRoutes.getMessages(this.currentGroup), {params: {skip: skip}})
        .then(response => {
          var messages = [];
          for (var result of response.data.messages) {
            messages.push(cryptMsg.decipherMessage(result));
          }
          this.messages   = messages.concat(this.messages);
          this.reachedTop = response.data.reachedTop;
          this.panelScrollDown();
          this.isLoading  = false;
      })
    },
    addMsg(e) {
      e.preventDefault();
      if (!this.newMsg) {
        return;
      }

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
    toggleChat() {
      this.$emit('toggle-chat', this.currentGroup);
    },
    closeChat() {
      this.$emit('close-chat', this.currentGroup);
    },
    showMembers() {
      if (this.isOpen) {
        this.membersVisible = true;
      }
    },
    hideMembers() {
      this.membersVisible = false;
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

  .member-list {
    list-style: none;
    min-width: 150px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    padding: 5px;
    z-index: 2;
    text-align: left;
    box-shadow: 0 0 10px;
  }
</style>
