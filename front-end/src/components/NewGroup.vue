<template>
  <div class="floating-panel">
    <form>
      <div class="floating-panel-header">
        <input type="text" class="form-control" placeholder="New group" v-model="groupName">
      </div>
        <div class="floating-panel-body">
          <div class="form-group">
            <div class="alert alert-danger" v-if="errors.noMembers">You must input at least one member</div>
            <div class="alert alert-danger" v-if="errors.invalidMember">UserId doesn't exist</div>
            <div class="input-group" v-for="(member, i) in members" :key="'member' + i">
              <input type="text" :id="'member' + i" list="userIds" class="form-control"
                  placeholder="Member" autocomplete="off"
                  v-model="member.user"
                  @keyup="memberLookup"
                  @change="checkMember">
              <datalist id="userIds">
                <option v-for="(friend, i) in friends" :value="friend" :key="'friend' +　i"/>
              </datalist>
              <span class="input-group-btn">
                <a class="btn btn-default" @click.capture="closeMemberInput" :id="'close' + i">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </a>
              </span>
            </div>
          </div>
        </div>
        <div class="floating-panel-footer">
            <input type="submit" class="btn btn-primary" v-on:click="submit">
        </div>
      </form>
  </div>
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
    memberLookup (e) {
      axios.get(routes.apiRoutes.findFriends(this.currentUser), {params: {friendId: e.target.value}})
        .then(results => {
          if (results.data.friends[0] === e.target.value) {
            this.friends = [];
          } else {
            this.friends = results.data.friends;
          }
        })

      // Create a new member input field
      if (this.members[this.members.length-1].user !== ''){
        this.members.push({user: ''})
      }
    },
    checkMember (e) {
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

      axios.post(routes.apiRoutes.userExists, {userId: e.target.value})
        .then(results => {
        if (!results.data.userExists) {
          this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = true;
        } else {
          this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = false;
        }
        this.countInvalidMembers();
      })
    },
    countInvalidMembers () {
      for (var i = 0; i < this.errors.invalidMembers.length; i++) {
        if (this.errors.invalidMembers[i]) {
          this.errors.invalidMember = true;
          return;
        }
      }
      this.errors.invalidMember = false;
    },
    closeMemberInput (e) {
      if (this.members.length > 1) {
        var memberId = e.currentTarget.id.slice(5, e.currentTarget.length);
        this.members.splice(memberId, 1);
        this.errors.invalidMembers.splice(memberId, 1);
        this.countInvalidMembers();
      }
    },
    submit (e) {
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
