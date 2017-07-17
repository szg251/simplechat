<template>
  <form>
    <h2>New Group</h2>
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Group name" v-model="groupName">
    </div>
    <div class="form-group">
      <div class="input-group" v-for="member in members">
        <input type="text" class="form-control" placeholder="Member"
            v-model="member.user"
            v-on:keyup="memberKeyup">
            <span class="input-group-btn">
              <a class="btn btn-default" v-on:click.capture="closeMemberInput" key="close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
            </span>
      </div>
    </div>
    <div class="form-group">
      <input type="submit" class="btn btn-primary" v-on:click="submit">
    </div>
  </form>
</template>

<script>
import axios from 'axios'
import routes from '../../config/routes'

export default {
  name: 'new-group',
  data() {
    return {
      groupName: '',
      members: [{user: ''}]
    }
  },
  methods: {
    memberKeyup: function() {
      if (this.members[this.members.length-1].user !== ''){
        this.members.push({user: ''})
      }
    },
    closeMemberInput: function(e) {
      console.log(e.target.key);
    },
    submit: function(e) {
      e.preventDefault();
      var members = [];
      for (var member of this.members){
        if (member.user != '') {
          members.push(member.user)
        }
      }
      axios.put(routes.apiRoutes.createGroup, {
        name: this.groupName,
        members: members
      });
    }
  }
}
</script>

<style lang="css">
</style>
