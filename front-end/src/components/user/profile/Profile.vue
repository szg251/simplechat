<template>
  <div class="col-md-offset-4 col-md-4">
    <profile-show v-if="!editMode" :userData="userData"></profile-show>
    <profile-edit v-else :userData="userData"></profile-edit>
  </div>
</template>

<script>
import axios from 'axios'
import routes from '../../../../config/routes'
import ProfileEdit from './ProfileEdit'
import ProfileShow from './ProfileShow'
import bus from './eventbus'



export default {
  name: 'profile',
  data() {
      return {
        editMode: true,
        userData: {
          userId: '',
          fullname: '',
          introduction: '',
          imageSrc: ''
        }
      }
  },
  props: ['currentUser'],
  components: {
    ProfileShow, ProfileEdit
  },
  created() {
    if (this.currentUser != '') {
      this.getUserData();
    }

    bus.$on('toggleEditMode', () => {
      this.toggleEditMode();
    })
  },
  methods: {
    getUserData() {
      axios.get(routes.apiRoutes.getUser(this.currentUser))
        .then(result => {
          this.userData.userId = result.data.user.userId,
          this.userData.fullname = result.data.user.fullname,
          this.userData.introduction = result.data.user.introduction,
          this.userData.imageSrc = result.data.user.imageSrc
        });
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    }
  },
  watch: {
    currentUser() {
      this.getUserData();
    }
  }
}
</script>
