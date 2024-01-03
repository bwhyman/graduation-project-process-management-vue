import axios from 'axios'
import type { ResultVO } from '@/types'
import { createMessageDialog } from '@/components/message'

axios.defaults.baseURL = '/api/'

axios.interceptors.request.use(
  (req) => {
    const auth = sessionStorage.getItem('token')
    // 判断,用于避免header包含authorization属性但数据值为空
    if (auth && req.headers) {
      req.headers.token = auth
    }
    return req
  },
  (error) => {
    createMessageDialog(error.message)
    return Promise.reject()
  }
)

// 递归实现反序列化为JS对象
const parseObject = (data: any) => {
  let newValue = data

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Array) {
      value.forEach((d) => {
        parseObject(d)
      })
    }
    if (typeof value == 'object') {
      parseObject(value)
    }

    if (typeof value == 'string' && (value.includes('{"') || value.includes('['))) {
      try {
        newValue = JSON.parse(value)
        if (typeof newValue == 'object') {
          data[key] = parseObject(newValue)
        }
      } catch (error) {
        //
      }
    }
  }
  return newValue
}

axios.interceptors.response.use(
  (resp) => {
    if (resp.config.responseType == 'blob') {
      return resp
    }

    const data: ResultVO<{}> = resp.data
    if (data.code < 300) {
      parseObject(resp.data.data)
      return resp
    }

    if (data.code >= 400) {
      data.message && createMessageDialog(data.message)
      return Promise.reject()
    }
    return resp
  },
  // 全局处理异常信息。即，http状态码不是200
  (error) => {
    error.message && createMessageDialog(error.message)
    return Promise.reject()
  }
)

export default axios
