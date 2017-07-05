<template>
  <div>
    <div class="nav navbar navbar-inverse">
      <div class="container">
        <div class="navbar-brand">{{title}}</div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      title: 'Chat application'
    }
  }
}
</script>

<style>
  @import '../bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
