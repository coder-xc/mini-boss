/**
 * 包含n个用于间接更新状态数据的方法的对象
 * 可以包含异步/逻辑操作代码
 */
import { TOGGLE_COLLAPSE } from './mutation-types'
export default {
  toggleCollapse({ commit, state }) { // state是根/总state
    commit(TOGGLE_COLLAPSE)
    // commit('xxx') // 找到所有同名匹配的mutation执行
  }
}