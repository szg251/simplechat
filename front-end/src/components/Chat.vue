<template>
  <div>
    <div class="chat-container">
      <div class="floating-panel" :class="{'panel-open' : groupListOpen}">
        <div class="floating-panel-header" @click="toggleGroupList">
          Group list
        </div>
        <div class="group-list" v-if="groupListOpen">
          <div class="floating-panel-body">
            <ul>
              <li v-for="group in groups"
                  :key="'group_' + group._id"
                  :id="'group_' + group._id"
                  @click="showGroup">
                  {{group.name}}
              </li>
            </ul>
          </div>
          <div class="floating-panel-footer">
            <a @click="toggleNewGroup" class="btn btn-default">Create a new group</a>
          </div>
        </div>
      </div>
      <chat-panel class="floating-panel"
          v-for="group in openGroups"
          :key="'chat-panel-' + group._id"
          :id="'chat-panel-' + group._id"
          :isOpen="group.isOpen"
          :currentGroup="group._id"
          :currentUser="currentUser"
          @toggle-chat="toggleChat"
          @close-chat="closeChat" />

      <new-group class="floating-panel panel-open"
          v-if="showNewGroup"
          :currentUser="currentUser"
          @close-newgroup="toggleNewGroup"
          @finish-newgroup="finishNewGroup" />
    </div>
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
      openGroups: [],
      showNewGroup: false,
      groupListOpen: false
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
    }
  },
  methods: {
    getUserData () {
        axios.get(routes.apiRoutes.getGroups(this.currentUser))
          .then(response => {
            this.groups = response.data.groups;
          })

    },
    showGroup (e) {
      var groupId = e.target.id.slice(6, e.target.id.length);
      var openGroupIndex = this.openGroups.findIndex(element => { return element._id == groupId });
      if (openGroupIndex == -1) {
        this.openGroups.push({
          _id: groupId,
          isOpen: true
        })
        if (this.openGroups.length > 3) {
          this.openGroups.splice(0, 1);
        }
      } else {
        this.openGroups[openGroupIndex].isOpen = !this.openGroups[openGroupIndex].isOpen;
      }
    },
    toggleNewGroup () {
      this.showNewGroup = !this.showNewGroup;
    },
    finishNewGroup (group) {
      this.showNewGroup = false;
      this.groups.push(group);
      this.openGroups.push({
        _id: group._id,
        isOpen: true
      });
    },
    toggleGroupList () {
      this.groupListOpen = !this.groupListOpen;
    },
    toggleChat (groupId) {
      var openGroupIndex = this.openGroups.findIndex(element => { return element._id == groupId });
      this.openGroups[openGroupIndex].isOpen = !this.openGroups[openGroupIndex].isOpen;
    },
    closeChat (groupId) {
      var openGroupIndex = this.openGroups.findIndex(element => { return element._id == groupId });
      this.openGroups.splice(openGroupIndex, 1);
    },
  }

}
</script>

<style lang="scss">

  $user-color: #000;
  $friend-color: #00f;
  $chat-header-background: #abc;
  $chat-header-color: darken($chat-header-background, 60%);
  $group-list-hovered: lighten($chat-header-background, 20%);
  $chat-background: #fff;

  .panel-open{
    height: 300px;
    transform: translate(0, -270px);
  }

  .chat-container {
    bottom: 0;
    position: fixed;
    height: 30px;
    z-index: 1000;
  }

  .floating-panel {
    position: relative;
    margin: 0 10px 0 10px;
    max-height: 300px;
    width: 220px;
    float: left;
    background-color: $chat-background;
    border-radius: 2px;
    box-shadow: 0 0 10px;

    .floating-panel-header {
      padding: 5px 5px;
      height: 30px;
      font-weight: bold;
      background-color: $chat-header-background;
      cursor: pointer;
      color: $chat-header-color;

      .header-btn {
        float: right;
        color: lighten($chat-header-color, 40%);
        padding: 0 7px  ;
      }

      .header-btn:hover {
        color: $chat-header-color;
      }

      input {
        width: 175px;
        height: 100%;
        border: 0;
        border-radius: 2px;
        padding: 0 5px;
        background-color: lighten($chat-header-background, 10%);
      }

      input:focus {
        border: 0;
        background-color: lighten($chat-header-background, 15%);
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
      // display: none;
    }

    .floating-panel-footer {
      position: absolute;
      bottom: 0px;
      padding: 10px;
      z-index: 100;
      // display: none;
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

  .group-list {

    .floating-panel-body {
      padding: 0 !important;
    }

    ul {
      padding: 0;

      li {
        list-style: none;
        padding: 15px;
        cursor: pointer;
      }
      li:hover {
        background-color: $group-list-hovered;
      }
    }
  }
</style>
