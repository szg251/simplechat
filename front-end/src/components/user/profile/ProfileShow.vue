<template>
  <div>
    <div class="thumbnail">
      <img :src="userData.imageSrc" alt="">
    </div>
    <div><strong>UserId:</strong> {{userData.userId}}</div>
    <div><strong>Fullname:</strong> {{userData.fullname}}</div>
    <div><strong>Introduction:</strong> {{userData.introduction}}</div>
    <a @click="toggleEditMode" class="btn btn-default">Edit</a>
  </div>
</template>

<script>
import bus from './eventbus'

export default {
  name: 'profile-show',
  data() {
      return {

      }
  },
  props: ['currentUser', 'userData'],
  methods: {
    toggleEditMode() {
      bus.$emit('toggleEditMode');
    }
  }
}
</script>
