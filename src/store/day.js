export default {
  namespaced: true,
  state: {
    week: []
  },
  mutations: {
    setWeek: (state, value) => state.week = value
  },
  actions: {
    setWeek: (context, value) => {
      context.commit('setWeek', value)
    }
  },
  getters: {
    week: (state) => state.week
  }
}
