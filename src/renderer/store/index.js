import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app: {
      fontsList: null,
    },
    steps: {
      current: 'dashboard',
    },
    project: {
      type: '',
      template: {},
      slides: [],
      audioFilename: '',
      timeline: {
        duration: 60000,
      }
    },
    timelineEditor: {
      audio: null,
      currentTime: 0,
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
