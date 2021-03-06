import axios from 'axios'
import Qs from 'qs'

export const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:8000';
// 定义登录服务接口的,也是必须要的(/服务名称/真实的url
export const loginUrl = "/u/login";
// 默认允许携带cookie
axios.defaults.withCredentials = false;
// 认证的请求头
export const headerName = 'token';
// 认证请求头前缀
export const headerPrefix = 'Bearer';
// 用户权限信息缓存
export const permissionName = 'permission';
// 用户菜单信息缓存
export const menuName = 'menu';
// 登录成功后的服务
export const serviceName = "serviceName";
// 标签页面管理
export const menuTag = 'menuTag';

/***
 * 全局的ajax请求方法
 * @param method 请求的方式
 * @param url 请求的url
 * @param data 请求的参数
 * @param success 请求成功后的处理函数
 * @param vm 当前指针
 */
export const ajax = function (method, url, data, success, vm) {
  url = getRequestURL(url, vm);
  if (url === undefined) {
    return false
  }
  axios({
    method: method,
    url: baseURL + url,
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

};

/**
 *  post 文件表单上传方法
 * @param url: 访问的URL
 * @param params 表单参数
 * @param success 成功后的的处理
 * @param vm 返回结果
 */
export const ajaxFormData = function (url, params, success, vm) {
  url = getRequestURL(url, vm);
  if (url === undefined) {
    return false
  }
  axios.post(baseURL + url, params, {headers: {token: getToken()}}).then(function (res) {
    result(res, vm, success)
  })
};

/**
 * ajax结果统一处理
 * @param res 响应对象
 * @param vm 当前指针对象
 * @param success 操作成处理方法
 */
function result(res, vm, success) {
  // 请求成功后,存放token到session中
  setToken(res.headers.token);
  if (res.status !== 200) {
    vm.$Message.error("网络请求失败,响应码:" + res.status)
  } else {
    if (res.data.code === 200) {
      // 操作成功后的处理
      if (success) {
        success(res)
      }
    } else if (res.data.code === -3) {
      vm.$Message.error(res.data.msg ? res.data.msg : '操作失败');
      vm.$router.push('/login')
    } else {
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
};
/***
 * 存放token
 * @param key 请求头
 * @param value token值
 */
export const setToken = function (value) {
  return sessionStorage.setItem(headerName, headerPrefix + value)
};

/**
 * 从sessionStorage中获取值
 * @returns {string}
 */
export const getSession = function (key) {
  return sessionStorage.getItem(key)
};
/**
 * 往sessionStorage中存放值
 * @param key key
 * @param value value
 */
export const setSession = function (key, value) {
  return sessionStorage.setItem(key, value)
};
/***
 *  根据传入的URL 编码获取真实的url
 * @param key
 * @param vm 当前对象的this 指针,用于全局弹框提示.
 * @returns {string}
 */
export const getRequestURL = function (key, vm) {
  if (typeof key === 'string') {
    return key
  } else {
    let res = getResources(key);
    if (res === undefined) {
      // 提示没有权限访问该资源
      vm.$Message.warning("你没有权限访问该资源");
      return undefined
    } else {
      return res
    }
  }
};
/***
 * 权限缓存处理(服务名称+权限名称)组合完整的URL
 * @param permissionList 权限集合
 */
export const setResources = function (permissionList) {
  let permission = {};
  let serverMap = JSON.parse(getSession(serviceName));
  permissionList.map(function (item) {
    // 有可能 服务被停用了,导致服务连接不可用
    if (serverMap[item.serverId] !== undefined) {
      // 处理如果是默认服务/ 就不添加前缀
      if (serverMap[item.serverId] === "/") {
        permission[item.id] = item.url
      } else {
        permission[item.id] = serverMap[item.serverId] + item.url
      }
    }
  });
  setSession(permissionName, JSON.stringify(permission))
};

/***
 *  服务处理
 * @param service 服务集合
 */
export const setServerName = function (service) {
  let server = {};

  service.map(function (item) {
    server[item.id] = item.url
  });

  setSession(serviceName, JSON.stringify(server))
};

/**
 * 网络请求前,获取key 对应的真正的URL
 * @param key key
 * @returns {string}
 */
export const getResources = function (key) {
  let url = getSession(permissionName);
  if (url == null) {
    return undefined
  } else {
    return JSON.parse(url)[key]
  }
};

/***
 * 菜单树形结构组装
 * @param data 后台返回的Map对象的菜单数组
 */
export const tree = function (data) {
  let res = [];
  // 遍历与组装了
  data.map(function (item, index) {
    let value = {};
    value.title = item.name;
    value.id = item.id;
    if (item.child) {
      // 遍历孩子
      let child = [];
      item.child.map(function (item, index) {
        let data = {};
        data.id = item.id;
        data.title = item.name;
        data.status = true;
        child[index] = data;
      });
      value.children = child;
    } else {
      value.children = [];
      data.status = false;
    }
    res[index] = value
  });
  return res
};
/***
 * 权限树组装
 * @param data1 菜单信息
 * @param data2 权限信息
 */
export const permissionTree = function (data1, data2) {
  let menu = this.tree(data1);
  //遍历权限
  data2.map(function (item, index) {
    let mid = item.mid;
    let pid = item.id;
    let pname = item.name;
    // 遍历一级菜单
    menu.map(function (item, index) {
      let loop = false;
      if (item.children) {
        // 遍历二级菜单
        item.children.map(function (item, index) {
          if (item.id === mid) {
            // 将权限添加到二级菜单下,作为三级菜单
            if (!item.children) {
              item.children = []
            }
            let data = {};
            data.title = pname;
            data.id = pid
            // 用于标记这个是个权限而非菜单
            data.type = true;
            item.children[item.children.length] = data;
            loop = true;
            return false;
          }
        });
      }
      // 表示结束当前循环
      if (loop) {
        return false
      }

    })

  })
  return menu;
}

/***
 * 角色权限树 遍历
 * @param data1 全部角色权限树
 * @param data2 角色拥有的权限
 */
export const rolePermissionTree = function (data1, data2) {
  // 遍历已经有的权限
  data2.map(function (item) {
    let pid = item.id
    // 遍历一级菜单
    data1.map(function (item) {
      if (item.children) {
        item.selected = true
        // 遍历二级菜单
        item.children.map(function (item) {
          if (item.children) {
            // 遍历权限
            item.children.map(function (item) {
              if (item.id === pid && item.type) {
                item.checked = true
              }
            })
          }
        })
      }
    })
  })
  return data1;
}



