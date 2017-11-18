// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import SignUp from './components/user/SignUp'
import Login from './components/user/Login'
import Profile from './components/user/profile/Profile'
import Friends from './components/user/Friends'
import FriendRequests from './components/user/FriendRequests'
import Friend from './components/user/Friend'
import MainPage from './components/MainPage'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
  {path: '/', component: MainPage},
  {path: '/signup', component: SignUp},
  {path: '/login', component: Login},
  {path: '/user/friends', component: Friends},
  {path: '/user/friendrequests', component: FriendRequests},
  {path: '/user/friend/:friendId', component: Friend, props: true},
  {path: '/user/profile', component: Profile}
]

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
