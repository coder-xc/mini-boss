/**
 * 包含n个日期时间处理的工具函数模块
 */

/**
 * 格式化日期
 */
export function formateDate(time) {
  if (!time) return ''
  const date = new Date(time)
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let seconds = date.getSeconds();

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${date.getFullYear()}-${month}-${day} ${hour}:${min}:${seconds}`;
}