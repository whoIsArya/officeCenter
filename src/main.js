// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import Router from 'vue-router'
import App from './App'
import routerConfig from './router/index.js'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css';

Vue.use(Router);
Vue.use(iView);

var router = new Router(routerConfig);
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
let ajax = axios.create({
  baseURL: '/API/'
});

Vue.prototype.$http= ajax;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
