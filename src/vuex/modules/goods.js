import { 
  reqActiveList, 
  reqGoods 
} from '../../api'

import { 
  RECEIVE_ACTIVE_LIST, 
  RECEIVE_GOODS_LIST,
  RECEIVE_GOODS
} from '../mutation-types'

const state = {
  activeList: [],
  activeTotal: 0,
  goodsList: [],
  goodsTotal: 0,
  currentGoods: JSON.parse(sessionStorage.getItem('goods') || '{}')
}


const actions = {
  async getActiveList({ commit, state }) {
    const result = await reqActiveList()
    commit(RECEIVE_ACTIVE_LIST, result)
  },
  async getGoods({ commit, state }) {
    const result = await reqGoods()
    commit(RECEIVE_GOODS_LIST, result)
  },
  saveGoods({commit, state}, goods) {
    commit(RECEIVE_GOODS, goods)
  }
}

const mutations = {
  [RECEIVE_ACTIVE_LIST](state, { total, data }) {
    state.activeTotal = total
    state.activeList = data
  },
  [RECEIVE_GOODS_LIST](state, { total, data }) {
    state.goodsList = data;
    state.goodsTotal = total
  },
  [RECEIVE_GOODS](state, goods) {
    sessionStorage.removeItem('goods')
    state.currentGoods = goods
    sessionStorage.setItem('goods', JSON.stringify(goods));
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}