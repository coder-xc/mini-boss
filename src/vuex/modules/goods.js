import {
  reqActiveList,
  reqGoods,
  reqGoodsServices,
  reqCategories
} from '../../api';

import {
  RECEIVE_ACTIVE_LIST,
  RECEIVE_GOODS_LIST,
  RECEIVE_GOODS,
  RECEIVE_GOODS_SERVICE,
  RECEIVE_CATEGORIES
} from '../mutation-types';

const state = {
  activeList: [],
  activeTotal: 0,
  goodsList: [],
  goodsTotal: 0,
  currentGoods: JSON.parse(sessionStorage.getItem('goods') || '{}'),
  goodsService: [],
  servicesTotal: 0,
  categoryList: [],
  categoryTotal: 0,
};


const actions = {
  async getActiveList({ commit }) {
    const result = await reqActiveList();
    commit(RECEIVE_ACTIVE_LIST, result);
  },
  async getGoods({ commit }) {
    const result = await reqGoods()
    commit(RECEIVE_GOODS_LIST, result);
  },
  saveGoods({ commit }, goods) {
    commit(RECEIVE_GOODS, goods);
  },
  async getGoodsService({ commit }) {
    const result = await reqGoodsServices();
    commit(RECEIVE_GOODS_SERVICE, result);
  },
  async getCategory({ commit }) {
    const result = await reqCategories();
    commit(RECEIVE_CATEGORIES, result)
  }
};

const mutations = {
  [RECEIVE_ACTIVE_LIST](state, { total, data }) {
    state.activeTotal = total;
    state.activeList = data;
  },
  [RECEIVE_GOODS_LIST](state, { total, data }) {
    state.goodsList = data;
    state.goodsTotal = total;
  },
  [RECEIVE_GOODS](state, goods) {
    sessionStorage.removeItem('goods')
    state.currentGoods = goods;
    sessionStorage.setItem('goods', JSON.stringify(goods));
  },
  [RECEIVE_GOODS_SERVICE](state, { data, total }) {
    state.goodsService = data;
    state.servicesTotal = total;
  },
  [RECEIVE_CATEGORIES](state, { data, total }) {
    state.categoryList = data;
    state.categoryTotal = total;
  }
};

const getters = {};

export default {
  state,
  mutations,
  actions,
  getters
};