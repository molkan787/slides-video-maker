import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
