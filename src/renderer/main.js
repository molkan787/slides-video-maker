import path from 'path'
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import store from './store'
import vuetify from './plugins/vuetify'
import shell from './shell'
import { loadCSSFile } from './helpers'

import '@mdi/font/css/materialdesignicons.css'

const stylesDir = path.join(__static, 'webpage', 'styles')
loadCSSFile(path.join(stylesDir, 'costra.css'))
loadCSSFile(path.join(stylesDir, 'costra_kinetic.css'))

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.filter('time', value => {
  const time = parseFloat(value) / 1000;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  const _minutes = ('0' + minutes.toString()).substr(-2);
  const _seconds = ('0' + seconds.toString()).substr(-2);
  return `${_minutes}:${_seconds}`;
})


new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

shell.load();
