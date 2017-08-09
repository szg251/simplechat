<template>
  <div :class="{'panel-open' : isOpen}">

    <div class="floating-panel-header" @click="toggleChat">
      <span @mouseover="showMembers" @mouseout="hideMembers">{{currentGroup.name}}</span>
      <span class="header-btn glyphicon glyphicon-remove" @click="closeChat" />
      <span v-if="currentGroup.owner == currentUser" class="header-btn glyphicon glyphicon-cog" @click="editGroup" />
      <ul class="member-list" v-if="membersVisible">
        <li>Me</li>
        <li v-for="(member, i) in currentGroup.members" v-if="member._id != currentUser" :key="'member' + i">
          {{member._id}}
        </li>
      </ul>
    </div>

    <div class="chat-panel" v-if="isOpen">

      <div class="floating-panel-body">
        <div class="loading" v-if="isLoading">loading...</div>
        <div class="message"
            v-for="(message, i) in messages" :key="'message' + i"
            :class="{msgFromOther: message.user != currentUser}"  >
          <div class="timestamp" v-if="message.showTime">{{message.time | dateFormatter}}</div>
          <div class="namestamp">{{message.user}}</div>
          <div class="message-body">{{message.text}}</div>
        </div>
      </div>

      <div class="floating-panel-footer">
        <form class="new-msg">
          <div class="input-group input-group-sm">
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
import routes from '../../../config/routes'
import io from 'socket.io-client'
import cryptMsg from '../../../security'
import moment from 'moment'

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
      scrollHeight: 0,
      scrollPos: 0
    }
  },
  props: ['currentGroup', 'currentUser', 'isOpen'],
  watch: {
    currentGroup() {
      this.getMessages(0);
    },
    isOpen() {
      if (this.isOpen) {
        this.onOpen();
      }
    },
    messages() {
      if (this.messages.length == 0) {
        return;
      }
      this.messages[0].showTime = true;
      for (var i = 1; i < this.messages.length; i++) {
        if ( this.messages[i].showTime == null ) {
          var newMsg = new Date(this.messages[i].time);
          var oldMsg = new Date(this.messages[i-1].time);

          this.messages[i].showTime = (oldMsg.getTime() < newMsg.getTime() - 60000);
        }
      }
    }
  },
  filters: {
      dateFormatter (value) {
        var date = new Date(value);
        var test = new Date();
        test.setHours(0);
        test.setMinutes(0);
        test.setSeconds(0);

        // today
        if (test < date) {
          return moment(date).format('H:mm');
        }

        // day of week
        test.setDate(test.getDate() - 6);
        if (test < date) {
          return moment(date).format('(ddd) h:mm');
        }

        // older
        return moment(date).format('YYYY/MM/DD h:mm');
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
      this.messages.push(cryptMsg.decipherMessage(message));
      this.panelScrollDown(true);
    })

    if (this.currentGroup._id != '') {
      this.getMessages(0);
    }
  },
  mounted() {
    this.onOpen();
  },
  methods: {
    onOpen () {
      this.$nextTick(() => {
        // setting the scroll position to the saved state
        var chatPanel = document.querySelector('#chat-panel-' + this.currentGroup._id + ' .floating-panel-body');
        chatPanel.scrollTop = this.scrollPos;
        // creating an event listener which saves the current scroll state and fires
        // an API call when the scroll is on the top
        chatPanel.addEventListener('scroll', e => {
          this.scrollPos = e.target.scrollTop;
          if (this.scrollPos == 0 && !this.reachedTop) {
            this.getMessages(this.messages.length);
          }
        });
      })
    },
    // get messages from API
    // only 10 messages are transferred, so we cat get
    // the corresponding messages by the skip value
    getMessages(skip) {
      this.isLoading = true;

      axios.get(routes.apiRoutes.getMessages(this.currentGroup._id), {params: {skip: skip}})
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
        group: this.currentGroup._id,
        text: this.newMsg,
        time: Date.now()
      }

      this.messages.push(newMsg);
      socket.emit('message from client', cryptMsg.cipherMessage(newMsg));
      this.newMsg = '';
      this.panelScrollDown(true, true);
    },
    toggleChat() {
      this.$emit('toggle-chat', this.currentGroup._id);
    },
    editGroup() {
      this.$emit('edit-group', this.currentGroup._id);
    },
    closeChat() {
      this.$emit('close-chat', this.currentGroup._id);
    },
    showMembers() {
      if (this.isOpen) {
        this.membersVisible = true;
      }
    },
    hideMembers() {
      this.membersVisible = false;
    },
    panelScrollDown (toBottom, forced) {
      this.$nextTick(function() {
        var chatPanel = document.querySelector('#chat-panel-' + this.currentGroup._id + ' .floating-panel-body');
        var panelHeight = chatPanel.scrollHeight;

        if (toBottom && ( forced || (chatPanel.scrollTop + chatPanel.clientHeight) == this.scrollHeight )) {
          this.scrollPos = chatPanel.scrollTop = panelHeight;
        } else if (!toBottom) {
          this.scrollPos = chatPanel.scrollTop = panelHeight - this.scrollHeight;
        }
        this.scrollHeight = panelHeight;
      })
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
