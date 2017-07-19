<template>
  <form>
    <h2>New Group</h2>
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Group name" v-model="groupName">
    </div>
    <div class="form-group">
      <div class="alert alert-danger" v-if="errors.noMembers">You must input at least one member</div>
      <div class="alert alert-danger" v-if="errors.invalidMember">UserId doesn't exist</div>
      <div class="input-group" v-for="(member, i) in members">
        <input type="text" :id="'member' + i" list="userIds" class="form-control" placeholder="Member"
            v-model="member.user"
            v-on:keyup="memberKeyup"
            v-on:change="checkMember">
            <datalist id="userIds">
              <option v-for="friend in friends" :value="userId"/>
            </datalist>
            <span class="input-group-btn">
              <a class="btn btn-default" v-on:click="closeMemberInput" :id="'close' + i"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
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
      members: [{user: ''}],
      friends: [],
      errors: {
        noMembers: false,
        invalidMembers: [],
        invalidMember: false
      }
    }
  },
  props: ['currentUser'],
  methods: {
    memberKeyup: function(e) {
      axios.get(routes.apiRoutes.getFriends(this.currentUser), {userId: e.target.value})
        .then(results => {
          this.userIds = results.data.friends;
        })
      if (this.members[this.members.length-1].user !== ''){
        this.members.push({user: ''})
      }
    },
    checkMember: function(e) {
      if (e.target.value === '') {
        this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = false;
        for (var i = 0; i < this.errors.invalidMembers.length; i++) {
          if (this.errors.invalidMembers[i]) {
            this.errors.invalidMember = true;
            return;
          }
        }
        this.errors.invalidMember = false;
        return;
      } 

      axios.get(routes.apiRoutes.userExists(e.target.value))
        .then(results => {
        if (!results.data.userIdExists) {
          this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = true;
        } else {
          this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = false;
        }
        for (var i = 0; i < this.errors.invalidMembers.length; i++) {
          if (this.errors.invalidMembers[i]) {
            this.errors.invalidMember = true;
            return;
          }
        }
        this.errors.invalidMember = false;
      });

      // console.log(this.errors)
      
      
    },
    closeMemberInput: function(e) {
      if (this.members.length > 1) {
        var memberId = e.toElement.id.slice(5, e.toElement.length);
        this.members.splice(memberId, 1);
      }
    },
    submit: function(e) {
      e.preventDefault();
      if (this.errors.invalidMember || this.errors.noMembers) {
        return;
      }
      var members = [];
      for (var i = 0; i < this.members.length; i++){
        var isDuplicate = false;
        for (var j = 0; j < i; j++) {
          if (this.members[i].user === this.members[j].user) {
            isDuplicate = true;
            break;
          }
        }

        if (!isDuplicate && this.members[i].user != '') {
          members.push(this.members[i].user)
        }

      }
      console.log('length: ' +　members.length);
      if (members.length > 0) {
        axios.put(routes.apiRoutes.createGroup, {
          name: this.groupName,
          members: members
        });
      } else {
        this.errors.noMembers = true;
      }
    }
  }
}
</script>

<style lang="css">
</style>
