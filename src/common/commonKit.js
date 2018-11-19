import axios from 'axios'
import Qs from 'qs'

export const baseURL = process.env.root

// axios 全局默认设置
axios.defaults.baseURL = 'http://127.0.0.1:8000/permission-api'
// 默认允许携带cookie
axios.defaults.withCredentials = false
// 认证的请求头
export const headerName = 'token'
// 认证请求头前缀
export const headerPrefix = 'Bearer'
// 用户权限信息缓存
export const permissionName = 'permission'
// 用户菜单信息缓存
export const menuName = 'menu'

// 标签页面管理
export const menuTag = 'menuTag'

/***
 * 全局的ajax请求方法
 * @param method 请求的方式
 * @param url 请求的url
 * @param data 请求的参数
 * @param success 请求成功后的处理函数
 * @param vm 当前指针
 */
export const ajax = function (method, url, data, success, vm) {
  url = getRequestURL(url, vm)
  if (url === undefined) {
    return false
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? data : null,
    params: data,
    timeout: 20000,
    headers: {
      token: getToken()
    },
    paramsSerializer: function (params) { //用来序列化请求参数的
      return Qs.stringify(params, {arrayFormat: 'brackets'})
    }
  }).then(function (res) {
      result(res, vm, success)
    }
  ).catch(function (error) {
    if (error) {
      vm.$Message.error('请求出错或服务器出错' + error)
    }
  })

}

/**
 *  post 文件表单上传方法
 * @param url: 访问的URL
 * @param params 表单参数
 * @param success 成功后的的处理
 * @param vm 返回结果
 */
export const ajaxFormData = function (url, params, success, vm) {
  url = getRequestURL(url, vm)
  if (url === undefined) {
    return false
  }
  axios.post(axios.defaults.baseURL + url, params, {headers: {token: getToken()}}).then(function (res) {
    result(res, vm, success)
  })
}

/**
 * ajax结果统一处理
 * @param res 响应对象
 * @param vm 当前指针对象
 * @param success 操作成处理方法
 */
function result(res, vm, success) {
  // 请求成功后,存放token到session中
  setToken(res.headers.token)
  if (res.status !== 200) {
    vm.$Message.error("网络请求失败,响应码:" + res.status)
  } else {
    if (res.data.code === 200) {
      // 操作成功后的处理
      if (success) {
        success(res)
      }
    } else if (res.data.code === -3) {
      vm.$Message.error(res.data.msg ? res.data.msg : '操作失败')
      vm.$router.push('/login')
    }
    else {
      vm.$Message.error(res.data.msg ? res.data.msg : '操作失败')
    }
  }
}

/***
 * token 的存放取出
 * @returns  返回token
 */
export const getToken = function () {
  return sessionStorage.getItem(headerName)
}
/***
 * 存放token
 * @param key 请求头
 * @param value token值
 */
export const setToken = function (value) {
  return sessionStorage.setItem(headerName, headerPrefix + value)
}

/**
 * 从sessionStorage中获取值
 * @returns {string}
 */
export const getSession = function (key) {
  return sessionStorage.getItem(key)
}
/**
 * 往sessionStorage中存放值
 * @param key key
 * @param value value
 */
export const setSession = function (key, value) {
  return sessionStorage.setItem(key, value)
}
/***
 *  根据传入的URL 编码获取真实的url
 * @param key
 * @returns {string}
 */
export const getRequestURL = function (key, vm) {
  if (typeof key === 'string') {
    return key
  } else {
    let res = getResources(key)
    if (res === undefined) {
      // 提示没有权限访问该资源
      vm.$Message.warning("你没有权限访问该资源")
      return undefined
    } else {
      return res
    }
  }
}
/**
 * 权限缓存处理
 * @param value
 */
export const setResources = function (value) {
  let permission = {}
  for (let valueKey in value) {
    permission[value[valueKey].id] = value[valueKey].url
  }
  setSession(permissionName, JSON.stringify(permission))
}
/**
 * 网络请求前,获取key 对应的真正的URL
 * @param key key
 * @returns {string}
 */
export const getResources = function (key) {
  return JSON.parse(getSession(permissionName))[key]
}


