<template>
  <div>
    <h2>{{userData.userId}}</h2>
    <div class="thumbnail">
      <img :src="userData.imageSrc" alt="">
    </div>
    <strong>{{userData.fullname}}</strong>
    <div>{{userData.introduction}}</div>
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
