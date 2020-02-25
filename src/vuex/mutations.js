/**
 * 包含n个用于直接更新状态数据的方法的对象
 */

import { TOGGLE_COLLAPSE } from './mutation-types'

export default {
  [TOGGLE_COLLAPSE](state) { // 总state
    state.isCollapseMenu = !state.isCollapseMenu;
  }
}