import request from '@/utils/request'


/**
 * 登录接口
 */
export const login = ({ username, password }) => request({
  url: '/auth/login',
  method: 'POST',
  data: {
    username,
    password
  }
})

/**
 * 根据token获取用户信息
 */
export const getUserInfo = () => request({
  url: '/auth/user',
  headers: {
    checkToken: true
  }
})

/**
 * 获取所有后台系统的用户
 */
export const getAdminUser = () => request({
  url: '/auth/users',
  headers: {
    checkToken: true
  }
})

/**
 * 添加用户
 */
export const addUser = ({ username, password }) => request({
  url: '/auth/register',
  method: 'POST',
  data: {
    username,
    password
  },
})

/**
 * 修改用户
 */
export const updateUser = ({ username, password, _id }) => request({
  url: `/auth/users/${_id}`,
  method: 'PUT',
  data: {
    username,
    password
  },
  headers: {
    checkToken: true
  }
})

/**
 * 删除用户
 */
export const delUser = ({ _id }) => request({
  url: `/auth/users/${_id}`,
  method: 'DELETE',
  headers: {
    checkToken: true
  }
})