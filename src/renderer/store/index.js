import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const sizes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 32, 36, 42, 48, 52, 58, 64, 70, 74, 80, 86, 90, 100, 110, 120, 130, 140, 150, 175, 200, 250, 300];
const fontSizes = sizes.map(s => ({
    value: (s / 1.6) + 'px',
    text: s
}));

export default new Vuex.Store({
  state: {
    app: {
      fontsList: null,
      fontSizes,
      animations: [
          { value: 'fade', text: 'Fade'},
          { value: 'zoom', text: 'Zoom'},
          { value: 'slide', text: 'Slide'},
      ],
      rawSlides: [],
      rawInputRequested: false,
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
    setProject({state}, project){
      Object.patch(state.project, project);
    }
  },
  modules: {
  }
})
