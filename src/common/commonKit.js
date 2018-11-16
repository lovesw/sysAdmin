import axios from 'axios'
import Qs from 'qs'

export const baseURL = process.env.root

// axios 全局默认设置
axios.defaults.baseURL = 'http://192.168.0.32:8082'
// 默认允许携带cookie
axios.defaults.withCredentials = false

export const headerName = 'Authorization'
/***
 * 全局的ajax请求方法
 * @param method 请求的方式
 * @param url 请求的url
 * @param data 请求的参数
 * @param success 请求成功后的处理函数
 * @param vm 当前指针
 */
export const ajax = function (method, url, data, success, vm) {
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? data : null,
    params: data,
    timeout: 20000,
    headers: {
      Authorization: getToken()
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
  axios.post(axios.defaults.baseURL + url, params, {headers: {Authorization: getToken()}}).then(function (res) {
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
  if (res.status !== 200) {
    vm.$Message.error("网络请求失败,响应码:" + res.status)
  } else {
    // 请求成功后,存放token到session中
    setToken(res.headers.authorization)
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
 * @param key
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
  return sessionStorage.setItem(headerName, 'Bearer' + value)
}



