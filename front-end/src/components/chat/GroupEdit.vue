<template>
  <div class="floating-panel">
    <form>
      <div class="floating-panel-header">
        <input type="text" class="panel-header-input" placeholder="New group"
            v-model="currentGroup.name"
            @change="checkGroupName">
        <span class="header-btn glyphicon glyphicon-remove" @click="cancel" />
      </div>
        <div class="floating-panel-body">
          <div class="form-group">
            <div class="alert alert-danger" v-if="errors.noGroupName">You must input a group name</div>
            <div class="alert alert-danger" v-if="errors.noMembers">You must input at least one member</div>
            <div class="alert alert-danger" v-if="errors.invalidMember">UserId doesn't exist</div>
            <div class="input-group input-group-sm" v-for="(member, i) in currentGroup.members" :key="'member' + i">
              <input type="text" :id="'member' + i" list="userIds" class="form-control"
                  placeholder="Member" autocomplete="off"
                  v-model="member._id"
                  @keyup="memberLookup"
                  @change="checkMember">
              <span class="input-group-btn">
                <a class="btn btn-default" @click.capture="closeMemberInput" :id="'close' + i">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </a>
              </span>
            </div>
            <datalist id="userIds">
              <option v-for="(friend, i) in friends" :value="friend" :key="'friend' +　i"/>
            </datalist>
          </div>
        </div>
        <div class="floating-panel-footer">
            <input type="reset" class="btn btn-default btn-sm" @click="cancel" value="Cancel">
            <input type="button" class="btn btn-default btn-sm" @click="remove" value="Delete">
            <input type="submit" class="btn btn-primary btn-sm" @click="submit" value="Edit">
        </div>
      </form>
  </div>
</template>

<script>
import axios from 'axios'
import routes from '../../../config/routes'

export default {
  name: 'group-edit',
  data() {
    return {
      friends: [],
      errors: {
        noGroupName: false,
        noMembers: false,
        invalidMembers: [],
        invalidMember: false
      }
    }
  },
  props: ['currentUser', 'currentGroup'],
  created() {
    if (this.currentGroup.members[this.currentGroup.members.length - 1]._id != '') {
      this.currentGroup.members.push({_id: ''})
    }
  },
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
      if (this.currentGroup.members[this.currentGroup.members.length-1]._id !== ''){
        this.currentGroup.members.push({_id: ''})
      }
    },
    checkGroupName () {
      this.errors.noGroupName = !this.currentGroup.name
    },
    checkMember (e) {
      if (e.target.value === '') {
        this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = false;

        this.errors.invalidMember = this.errors.invalidMembers.some(element => {
          return element;
        })
      }

      axios.post(routes.apiRoutes.userExists, {userId: e.target.value})
        .then(results => {
        if (!results.data.userExists) {
          this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = true;
        } else {
          this.errors.invalidMembers[e.target.id.slice(6, e.target.id.length)] = false;
        }

        this.errors.invalidMember = this.errors.invalidMembers.some(element => {
          return element;
        })
      })
    },
    closeMemberInput (e) {
      if (this.currentGroup.members.length > 1) {
        var memberId = e.currentTarget.id.slice(5, e.currentTarget.length);
        this.currentGroup.members.splice(memberId, 1);
        this.errors.invalidMembers.splice(memberId, 1);

        this.errors.invalidMembers.some(element => {
          return element;
        })
      }
    },
    remove () {
      axios.delete(routes.apiRoutes.deleteGroup(this.currentGroup._id));
      this.$emit('remove-group', this.currentGroup._id);
    },
    cancel () {
      this.$emit('close-groupedit', this.currentGroup);
    },
    submit (e) {
      e.preventDefault();
      if (this.errors.invalidMember || this.errors.noMembers || this.errors.noGroupName) {
        return;
      }

      var group = this.currentGroup;
      group.members = this.currentGroup.members.filter((member, i, members) => {
        return member._id
            && member._id != this.currentUser
            && (i == 0 || !members.slice(0, i).some(compare => { return compare._id === member._id}));
      }).map(member => { return member._id });

      if (group.members.length > 0) {
        axios.post(routes.apiRoutes.editGroup(this.currentGroup._id), group)
          .then(result => {
          if (result.data.success) {
            result.data.group.members = result.data.group.members
                .map(member => { return {_id: member} });
            this.$emit('finish-groupedit', result.data.group);

          }
        });
      } else {
        this.errors.noMembers = true;
      }
    }
  }
}
</script>
