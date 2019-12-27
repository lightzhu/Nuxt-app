import Vue from 'vue'
import Vuex from 'vuex'
import query from './modules/query'

Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    modules: {
      query
    },
    actions: {}
  })
}

export default store
