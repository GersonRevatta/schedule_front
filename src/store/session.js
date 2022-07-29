export default {
  namespaced: true,
  state: {
    authenticated: false,
    currentUser: null
  },
  mutations: {
    'set-authenticated': (state, value) => state.authenticated = value,
    'set-current-user': function(state, value) {
      state.currentUser = value
      localStorage.setItem('currentUser', JSON.stringify(value));
    }
  },
  actions: {
    'set-authenticated': (context, value) => context.commit('set-authenticated', value),
    'set-current-user': (context, value) => context.commit('set-current-user', value)
  },
  getters: {
    authenticated: (state) => state.authenticated,
    currentUser: (state) => (state.currentUser || JSON.parse(localStorage.getItem('currentUser'))),
  }
}
