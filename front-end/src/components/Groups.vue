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
    <chat class="col-md-3" v-if="currentGroup != ''"
        :currentGroup="currentGroup"
        :currentUser="currentUser">
    </chat>
    <new-group class="col-md-3" v-if="showNewGroup" :currentUser="currentUser"></new-group>
    <friends class="col-md-9" :currentUser="currentUser"></friends>
  </div>
</template>

<script>

import axios from 'axios'
import routes from '../../config/routes'
import Chat from './Chat'
import NewGroup from './NewGroup'
import Friends from './user/Friends'

axios.defaults.withCredentials = true;

export default {
  name: 'groups',
  data() {
    return {
      groups: [],
      currentGroup: '',
      showNewGroup: false
    }
  },
  components: {
    Chat, NewGroup, Friends
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
      this.showNewGroup = false;
      this.currentGroup = '';
      this.currentGroup = e.target.id.slice(6, e.target.id.length);
    },
    newGroup: function() {
      this.currentGroup = '';
      this.showNewGroup = true;
    }
  }

}
</script>
