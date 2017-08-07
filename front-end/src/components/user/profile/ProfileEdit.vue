<template>
  <div>
    <form>
      <div class="form-group">
        <h2>{{userData.userId}}</h2>
        <div class="thumbnail">
          <img :src="userData.imageSrc" alt="">
        </div>
        <label class="btn btn-default">Change
          <input type="file" name="userImg" class="hidden" accept="image/x-png,image/gif,image/jpeg" @change="uploadImg">
        </label>
        <a @click="clearImg" class="btn btn-default">Clear</a>
      </div>
      <div class="form-group">
        <label for="fullname">Fullname:</label>
        <input class="form-control" name="fullname" type="text" v-model="userData.fullname">
      </div>
      <div class="form-group">
        <label for="introduction">Introduction:</label>
        <textarea class="form-control" name="introduction" rows="3" v-model="userData.introduction"></textarea>
      </div>
      <div class="form-group">
        <input type="submit" class="btn btn-primary" name="submit" value="Submit" @click="submitEdit">
        <a class="btn btn-default" @click="cancelEdit">Cancel</a>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import routes from '../../../../config/routes'
import bus from './eventbus'

export default {
  name: 'profile-edit',
  data() {
    return {
    }
  },
  props: ['userData'],
  methods: {
    uploadImg(e) {
      var formData = new FormData();
      formData.append('userImg', e.target.files[0]);
      axios.put(routes.apiRoutes.uploadImg(this.$props.userData.userId), formData, {
          headers: {'Content-Type': 'multipart/form-data'}
      }).then(response => {
        if (response.data.success) {
          this.$props.userData.imageSrc = response.data.path
        }
      })
    },
    clearImg() {
      this.$props.userData.imageSrc = '';
    },
    submitEdit(e) {
      e.preventDefault();
      axios.post(routes.apiRoutes.editUser(this.$props.userData.userId), {
        fullname: this.$props.userData.fullname,
        introduction: this.$props.userData.introduction,
        imageSrc: this.$props.userData.imageSrc
      }).then(response => {
        if (response.data.success) {
          bus.$emit('toggleEditMode');
        }
      })
    },
    cancelEdit() {
      bus.$emit('toggleEditMode');
    }
  }
}
</script>
