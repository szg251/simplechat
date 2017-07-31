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
    <chat-panel class="col-md-3 floating-panel" v-if="currentGroup != ''"
        :currentGroup="currentGroup"
        :currentUser="currentUser">
    </chat-panel>
    <new-group class="col-md-3 floating-panel" v-if="showNewGroup" :currentUser="currentUser"></new-group>
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
  created: function() {
    if (this.currentUser != '') {
      this.getUserData();
    }
  },
  watch: {
    currentUser: function() {
      this.getUserData();
    }
  },
  methods: {
    getUserData: function() {
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
    showGroup: function(e) {
      var groupId = e.target.id.slice(6, e.target.id.length);

      this.showNewGroup = false;
      if (this.currentGroup != groupId) {
        this.currentGroup = groupId;
      } else {
        this.currentGroup = '';
      }
    },
    newGroup: function() {
      this.currentGroup = '';
      this.showNewGroup = !this.showNewGroup;
    }
  }

}
</script>

<style scoped lang="scss">
  $chat-background: #abc;

  .floating-panel {
    position: absolute;
    z-index: 1;
    background-color: $chat-background;
    border-radius: 10px;
  }
</style>
