// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Chat from './components/Chat'
import Test from './components/Test'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
  {path: '/', component: Chat},
  {path: '/test', component: Test}
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
