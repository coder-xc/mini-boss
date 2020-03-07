
import { reqActiveList } from 'api/activity';
import { reqGoods, reqGoodsServices } from 'api/goods';
import { reqCategories } from 'api/category';
import { reqMerchants } from 'api/merchant';
import { reqOrders } from 'api/order';
import { reqComment } from 'api/comment';

import {
  RECEIVE_ACTIVE_LIST,
  RECEIVE_GOODS_LIST,
  RECEIVE_GOODS,
  RECEIVE_GOODS_SERVICE,
  RECEIVE_CATEGORIES,
  RECEIVE_MERCHANTS,
  RECEIVE_ORDERS,
  RECEIVE_BACK_ROUTE_PATH,
  RECEIVE_COMMENTS
} from '../mutation-types';

const state = {
  activeList: [],
  activeTotal: 0,
  goodsList: null,
  goodsTotal: 0,
  currentGoods: JSON.parse(sessionStorage.getItem('goods') || '{}'),
  goodsService: null,
  servicesTotal: 0,
  categoryList: [],
  categoryTotal: 0,
  merchantList: [],
  merchantTotal: 0,
  orderList: null,
  orderTotal: 0,
  backRoutePath: sessionStorage.getItem('backRoutePath') || "",
  commentList: null,
  commentTotal: 0
};


const actions = {
  async getActiveList({ commit }, query) {
    const result = await reqActiveList(query);
    commit(RECEIVE_ACTIVE_LIST, result);
  },
  async getGoods({ commit }, query) {
    const result = await reqGoods(query)
    commit(RECEIVE_GOODS_LIST, result);
  },
  saveGoods({ commit }, goods) {
    commit(RECEIVE_GOODS, goods);
  },
  async getGoodsService({ commit }, query) {
    const result = await reqGoodsServices(query);
    commit(RECEIVE_GOODS_SERVICE, result);
  },
  async getCategory({ commit }, query) {
    const result = await reqCategories(query);
    commit(RECEIVE_CATEGORIES, result)
  },
  async getMerchants({ commit }, query) {
    const result = await reqMerchants(query);
    commit(RECEIVE_MERCHANTS, result);
  },
  async getOrders({ commit }, query) {
    const result = await reqOrders(query);
    commit(RECEIVE_ORDERS, result);
  },
  async getComments({ commit }, query) {
    const result = await reqComment(query);
    commit(RECEIVE_COMMENTS, result);
  },

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
  },
  [RECEIVE_ORDERS](state, { data, total }) {
    state.orderList = data;
    state.orderTotal = total;
  },
  [RECEIVE_BACK_ROUTE_PATH](state, path) {
    state.backRoutePath = path;
    sessionStorage.setItem('backRoutePath', path);
  },
  [RECEIVE_COMMENTS](state, { data, total }) {
    state.commentList = data;
    state.commentTotal = total;
  }
};

const getters = {};

export default {
  state,
  mutations,
  actions,
  getters
};