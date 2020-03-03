
import { reqActiveList } from 'api/activity';
import { reqGoods, reqGoodsServices } from 'api/goods';
import { reqCategories } from 'api/category';
import { reqMerchants } from 'api/merchant';

import {
  RECEIVE_ACTIVE_LIST,
  RECEIVE_GOODS_LIST,
  RECEIVE_GOODS,
  RECEIVE_GOODS_SERVICE,
  RECEIVE_CATEGORIES,
  RECEIVE_MERCHANTS
} from '../mutation-types';

const state = {
  activeList: [],
  activeTotal: 0,
  goodsList: null,
  goodsTotal: 0,
  currentGoods: JSON.parse(sessionStorage.getItem('goods') || '{}'),
  goodsService: [],
  servicesTotal: 0,
  categoryList: [],
  categoryTotal: 0,
  merchantList: [],
  merchantTotal: 0,
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
  },
  async getMerchants({ commit }) {
    const result = await reqMerchants();
    commit(RECEIVE_MERCHANTS, result)
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
  },
  [RECEIVE_MERCHANTS](state, { data, total }) {
    state.merchantList = data;
    state.merchantTotal = total;
  }
};

const getters = {};

export default {
  state,
  mutations,
  actions,
  getters
};