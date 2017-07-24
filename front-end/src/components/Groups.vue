<template>
  <div class="container">
    <!-- <div>
      <transition name="slide">
      <chat class="col-md-3" v-for="(group, i) in groups"
          :key="group"
          :currentGroup="group"
          :currentUser="currentUser">
      </chat>
      </transition>
      <transition>
        <button class="chat-btn btn" v-on:click="toggleChat" :id="'toggleChat' + i">{{isChatVisible ? '<' : '>'}}</button>
      </transition>
    </div> -->
    <div class="row">
      <div class="btn-group">
        <a class="btn btn-default" v-for="group in groups"
            :key="group._id"
            :id="'group_' + group._id"
            @click="showGroup">{{group.name}}</a>
        <a class="btn btn-default" @click="newGroup">+</a>
      </div>
    </div>
    <div class="row">
      <chat class="col-md-3" v-if="currentGroup != ''"
          :currentGroup="currentGroup"
          :currentUser="currentUser">
      </chat>
      <new-group class="col-md-3" v-if="showNewGroup" :currentUser="currentUser"></new-group>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import routes from '../../config/routes'
import Chat from './Chat'
import NewGroup from './NewGroup'

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
    Chat, NewGroup
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
