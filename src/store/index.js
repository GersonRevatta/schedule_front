import {createStore} from 'vuex'

import day from './day'
import session from './session'

export default createStore({
  modules: {
    day: day,
    session: session
  }
})
