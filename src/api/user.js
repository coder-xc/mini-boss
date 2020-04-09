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
export const getAdminUser = (query) => request({
  url: `/auth/users?query=${JSON.stringify(query)}`,
  headers: {
    checkToken: true
  }
})

/**
 * 添加用户
 */
export const addUser = ({ username, password, roles, permission }) => request({
  url: '/auth/register',
  method: 'POST',
  data: {
    username,
    password,
    roles,
    permission
  },
})

/**
 * 修改用户
 */
export const updateUser = ({ username, password, roles, permission, _id }) => request({
  url: `/auth/users/${_id}`,
  method: 'PUT',
  data: {
    username,
    password,
    roles,
    permission
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

/**
 * 获取角色列表
 */
export const reqRoles = (query) => request({
  url: `/roles?query=${JSON.stringify(query)}`
})

/**
 * 添加角色
 */
export const reqAddRole = ({ name, description, status, permission, _id }) => request({
  url: `/roles${_id ? `/${_id}` : ''}`,
  method: `${_id ? 'PUT' : 'POST'}`,
  data: {
    name,
    description,
    status,
    permission
  }
})

/**
 * 删除角色
 */
export const reqDelRole = ({ _id }) => request({
  url: `/roles/${_id}`,
  method: 'DELETE',
})