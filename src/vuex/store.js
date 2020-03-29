import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import getters from './getters'

import goods from './modules/goods';
import merchant from './modules/merchant';
import adminUser from './modules/admin-user';
import user from './modules/user';
import app from './modules/app'
import permission from './modules/permission'
import authConfig from './modules/auth-config'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapseMenu: false,
  },
  mutations,
  actions,
  getters,
  modules: {
    goods,
    merchant,
    adminUser,
    user,
    app,
    permission,
    authConfig
  }
})