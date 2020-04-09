/* 工具方法模块 */


/**
 * 合并数组并去重
 * @param {Array} origin 要被合并的数组
 * @param {Array} newArr 合并到origin的数组
 * @returns 返回一个新的数组（已经合并+去重）
 */
export function merge(origin, newArr) {
  let tempObj = {};
  const resultArr = [...origin];
  if (!newArr || newArr.length === 0) {
    return resultArr;
  }
  resultArr.forEach(item => {
    if(!tempObj[item._id]) {
      tempObj[item._id] = true;
    }
  })
  return newArr.reduce((pre, item) => {
    if(!tempObj[item._id]) {
      tempObj[item._id] = true;
      pre.push(item)
    }
    return pre;
  }, resultArr);
}