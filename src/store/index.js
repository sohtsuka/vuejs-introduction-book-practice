import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      token: null,
      userId: null
    },
    board: {
      lists: []
    }
  },
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
