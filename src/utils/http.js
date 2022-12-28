import axios from 'axios'
/*
 * 全局 axios 默认配置
 */
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL ?? '' // docker测试环境打开
axios.defaults.timeout = 120000
axios.defaults.withCredentials = true
// 公共请求头
// get 请求头
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.get.Accept = 'application/json'
// post 请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 添加请求前拦截器
axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    if (response.status === 401 || response.status === 444 || response.data.status === '1') {
      return
    }
    return response
  },
  function (error) {
    // const { response } = error
    // if (response) {
    // } else {
    // }
    return Promise.reject(error)
  }
)

function transformRequest(param) {
  return Object.keys(param)
    .map((key) => {
      const value = typeof param[key] === 'object' ? encodeURIComponent(JSON.stringify(param[key])) : param[key]
      return `${key}=${value}`
    })
    .join('&')
}

function request(config) {
  return new Promise((resolve, reject) => {
    axios
      .request(config)
      .then((res) => {
        if (res) {
          resolve(res.data)
        }
      })
      .catch((err) => {
        handleError(err)
        reject(err)
      })
  })
}

function handleError(err) {
  console.error(err)
}

export default {
  get(url, params = {}) {
    return request({
      url: url,
      method: 'get',
      params: params
    })
  },

  // post 请求可以带 queryParams，放到第三个参数
  post(url, body = {}, params = {}, fn) {
    return request({
      url: url,
      method: 'post',
      data: body,
      params: params,
      onUploadProgress: fn
    })
  },

  delete(url, params) {
    return request({
      url: url,
      method: 'delete',
      params: params,
      paramsSerializer: function (params) {
        return transformRequest(params)
      }
    })
  }
  //   head(url, params) {},
  //   options(url, params) {},
  //   put(url, params) {},
  //   patch(url, params) {}
}
