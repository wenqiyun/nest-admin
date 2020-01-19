import request from '@/utils/request.js'

/** 后台用户登录  */
export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function updatepassword (data) {
  return request({
    url: '/user/update-pw',
    method: 'put',
    data
  })
}

export function getUserPerms () {
  return request({
    url: '/perm',
    method: 'get'
  })
}
