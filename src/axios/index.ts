import { createMessageDialog } from '@/components/message'
import type { ResultVO } from '@/types'
import axios from 'axios'

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
      return Promise.reject(data.message)
    }
    return resp
  },
  // 全局处理异常信息。即，http状态码不是200
  (error) => {
    return Promise.reject(error.message)
  }
)

export const useGet = async <T>(url: string) => {
  const resp = await axios.get<ResultVO<T>>(url)
  return resp.data.data
}

export const usePost = async <T>(url: string, data: unknown) => {
  const resp = await axios.post<ResultVO<T>>(url, data)
  return resp.data.data
}

export const usePut = async <T>(url: string) => {
  const resp = await axios.put<ResultVO<T>>(url)
  return resp.data.data
}

export const usePatch = async <T>(url: string, data: unknown) => {
  const resp = await axios.patch<ResultVO<T>>(url, data)
  return resp.data.data
}

export const useDelete = async <T>(url: string) => {
  const resp = await axios.delete<ResultVO<T>>(url)
  return resp.data.data
}

export default axios
