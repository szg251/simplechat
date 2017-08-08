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
            <a @click="toggleGroupCreate" class="btn btn-default btn-sm">Create a new group</a>
          </div>
        </div>
      </div>
      <chat-panel class="floating-panel"
          v-for="group in openGroups"
          :key="'chat-panel-' + group._id"
          :id="'chat-panel-' + group._id"
          :isOpen="group.isOpen"
          :currentGroup="group"
          :currentUser="currentUser"
          @edit-group="openGroupEdit"
          @toggle-chat="toggleChat"
          @close-chat="closeChat" />

      <group-create class="floating-panel panel-open"
          v-if="showGroupCreate"
          :currentUser="currentUser"
          @close-groupcreate="toggleGroupCreate"
          @finish-groupcreate="finishGroupCreate" />

      <group-edit class="floating-panel panel-open"
          v-if="groupToEdit"
          :currentUser="currentUser"
          :currentGroup="groupToEdit"
          @close-groupedit="closeGroupEdit"
          @finish-groupedit="finishGroupEdit" />
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import routes from '../../../config/routes'
import ChatPanel from './ChatPanel'
import GroupCreate from './GroupCreate'
import GroupEdit from './GroupEdit'

axios.defaults.withCredentials = true;

export default {
  name: 'chat',
  data() {
    return {
      groups: [],
      openGroups: [],
      showGroupCreate: false,
      groupToEdit: '',
      groupListOpen: false
    }
  },
  components: {
    ChatPanel, GroupCreate, GroupEdit
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
            this.groups = response.data.groups.map(group => {
                 group.members = group.members.map(member => {
                   return { _id: member} 
                 });
                 return group;
              })
                  
          })

    },
    showGroup (e) {
      var groupId = e.target.id.slice(6, e.target.id.length);
      var openGroup = this.openGroups.find(element => { return element._id == groupId });
      var group = this.groups.find(element => { return element._id == groupId });
      if (!openGroup) {
        this.openGroups.push(Object.assign({isOpen: true}, group))
        if (this.openGroups.length > 3) {
          this.openGroups.splice(0, 1);
        }
      } else {
        openGroup.isOpen = !openGroup.isOpen;
      }
    },
    toggleGroupCreate () {
      this.showGroupCreate = !this.showGroupCreate;
    },
    finishGroupCreate (group) {
      this.showGroupCreate = false;
      this.groups.push(group);
      this.openGroups.push(Object.assign({}, group));
    },
    toggleGroupList () {
      this.groupListOpen = !this.groupListOpen;
    },
    toggleChat (groupId) {
      var openGroup = this.openGroups.find(element => { return element._id == groupId });
      openGroup.isOpen = !openGroup.isOpen;
    },
    closeChat (groupId) {
      var openGroupIndex = this.openGroups.findIndex(element => { return element._id == groupId });
      this.openGroups.splice(openGroupIndex, 1);
    },
    openGroupEdit (groupId) {
      var groupToEdit = Object.assign({}, this.groups.find(element => { return element._id == groupId }));
      this.groupToEdit = groupToEdit;
      this.closeChat(groupId);
    },
    closeGroupEdit(group) {
      this.groupToEdit = '';
      this.openGroups.push(Object.assign({isOpen: true}, group));
    },
    finishGroupEdit(group) {
      var groupIndex = this.groups.findIndex(element => { return element._id == group._id });
      this.groups[groupIndex] = group;
      this.closeGroupEdit(group)
    }
  }

}
</script>

<style lang="scss">

  $user-color: #a4243b;
  $friend-color: #363959;
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
      height: 220px;
      width: 100%;
      text-overflow: clip;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .floating-panel-footer {
      position: absolute;
      bottom: 0px;
      padding: 10px;
      z-index: 100;
    }
  }

  .message {
    text-align: left;
    color: $user-color;
    margin-top: 5px;

    .timestamp {
      text-align: center;
      font-size: x-small;
      color: lighten($user-color, 10%);
    }

    .namestamp {
      display: none;
    }

    .message-body {
      background-color: lighten($user-color, 50%);
      padding: 3px 10px;
      border-radius: 7px;
      display: inline;
    }
  }

  .msgFromOther {
    text-align: right;
    color: $friend-color;

    .timestamp {
      color: lighten($friend-color, 10%);
    }

    .namestamp {
      font-size: x-small;
      display: inherit;
      color: lighten($friend-color, 10%);
    }

    .message-body {
      background-color: lighten($friend-color, 50%);
    }
  }

  .group-list {

    .floating-panel-body {
      padding: 0;
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
