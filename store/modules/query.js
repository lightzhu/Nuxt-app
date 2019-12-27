const state = {
  list: []
}

const mutations = {
  GET_CODELIST: (state, data) => {
    state.list = data.data
  }
}

const actions = {
  getCodeList({ commit }, data) {
    console.log('0' + data)
    commit('GET_CODELIST', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
