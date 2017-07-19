<template>
  <div>
    <chat class="col-md-3" v-for="group in groups"
        :key="group"
        :currentGroup="group"
        :currentUser="currentUser">
    </chat>
    <new-group class="col-md-3" :currentUser="currentUser"></new-group>
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
      groups: []
    }
  },
  components: {
    Chat, NewGroup
  },
  props: ['currentUser'],
  watch: {
    currentUser: function() {
      axios.get(routes.apiRoutes.getGroups(this.currentUser))
        .then(function(results) {
          for(var result of results.data.groups) {
            this.groups.push(result._id);
          }

        }.bind(this))
      }

  }

}
</script>
