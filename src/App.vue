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
<script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

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

  .navbar {
    height: 10vh;
    margin-bottom: 0;
  }
</style>
