import { reqActiveList } from '../../api'
import { RECEIVE_ACTIVE_LIST } from '../mutation-types'

const state = {
  activeList: [],
  activeTotal: 0
}


const actions = {
  async getActiveList({ commit, state }) {
    const result = await reqActiveList()
    commit(RECEIVE_ACTIVE_LIST, result)
  }
}

const mutations = {
  [RECEIVE_ACTIVE_LIST](state, result) {
    state.activeTotal = result.total
    state.activeList = result.data
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}