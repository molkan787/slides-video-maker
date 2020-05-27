import path from 'path'
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadCSSFile } from './helpers'

import '@mdi/font/css/materialdesignicons.css'

const stylesDir = path.join(__static, 'webpage', 'styles')
loadCSSFile(path.join(stylesDir, 'costra.css'))
loadCSSFile(path.join(stylesDir, 'costra_kinetic.css'))

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
