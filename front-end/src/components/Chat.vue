<template>
  <div>
    <div class="navbar">
      <ul class="nav navbar-nav">
        <li v-for="group in groups"
          :key="group._id">
          <a :id="'group_' + group._id"
            @click="showGroup">{{group.name}}</a>
        </li>
        <li><a @click="newGroup">+</a></li>
      </ul>
    </div>
    <chat-panel class="floating-panel" v-if="currentGroup != ''"
        :currentGroup="currentGroup"
        :currentUser="currentUser">
    </chat-panel>
    <new-group class="floating-panel" v-if="showNewGroup" :currentUser="currentUser"></new-group>
  </div>
</template>

<script>

import axios from 'axios'
import routes from '../../config/routes'
import ChatPanel from './ChatPanel'
import NewGroup from './NewGroup'

axios.defaults.withCredentials = true;

export default {
  name: 'chat',
  data() {
    return {
      groups: [],
      currentGroup: '',
      showNewGroup: false
    }
  },
  components: {
    ChatPanel, NewGroup
  },
  props: ['currentUser'],
  created () {
    if (this.currentUser != '') {
      this.getUserData();
    }
  },
  watch: {
    currentUser () {
      this.getUserData();
    },
    '$route': function () {
      this.hideAll();
    }
  },
  methods: {
    getUserData () {
        axios.get(routes.apiRoutes.getGroups(this.currentUser))
          .then(results => {
            this.groups = [];
            for(var result of results.data.groups) {
              axios.get(routes.apiRoutes.getGroup(result._id))
                .then(response => {
                  this.groups.push(response.data.group);
              });

            }
          })

    },
    showGroup (e) {
      var groupId = e.target.id.slice(6, e.target.id.length);

      this.showNewGroup = false;
      if (this.currentGroup != groupId) {
        this.currentGroup = groupId;
      } else {
        this.currentGroup = '';
      }
    },
    newGroup () {
      this.currentGroup = '';
      this.showNewGroup = !this.showNewGroup;
    }
  }

}
</script>

<style lang="scss">

  $user-color: #000;
  $friend-color: #00f;
  $chat-header-background: #abc;
  $chat-header-color: darken($chat-header-background, 60%);
  $chat-background: #fff;

  .floating-panel {
    height: 300px;
    width: 220px;
    position: absolute;
    z-index: 1;
    background-color: $chat-background;
    border-radius: 2px;
    box-shadow: 0 0 10px;

    .floating-panel-header {
      padding: 10px;
      font-weight: bold;
      text-align: center;
      background-color: $chat-header-background;
      a {
        color: $chat-header-color;
      }

      .member-list {
        list-style: none;
        min-width: 200px;
        background-color: $chat-background;
        border-radius: 5px;
        position: absolute;
        padding: 5px;
        z-index: 2;
        text-align: left;
        box-shadow: 0 0 10px;
      }
    }

    .floating-panel-body {
      position: absolute;
      padding: 10px;
      height: 210px;
      width: 100%;
      text-overflow: clip;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .floating-panel-footer {
      position: absolute;
      bottom: 0px;
      padding: 10px;
    }
  }

  .message {
    text-align: left;
    color: $user-color;

    .timestamp {
      font-size: x-small;
      color: lighten($user-color, 10%);
    }
  }

  .msgFromOther {
    text-align: right;
    color: $friend-color;

    .timestamp {
      font-size: x-small;
      color: lighten($friend-color, 10%);
    }
  }
</style>
