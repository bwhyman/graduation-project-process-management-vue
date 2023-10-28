import axios from 'axios'
import type { ResultVO } from '@/types/type'
import { useMessageStore } from '@/stores/MessageStore'

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
    const store = useMessageStore()
    store.messageS = error.message
    return Promise.reject()
  }
)

axios.interceptors.response.use(
  (resp) => {
    if (resp.config.responseType == 'blob') {
      return resp
    }
    // 从响应获取响应体对象
    const data: ResultVO<{}> = resp.data
    if (data.code < 300) {
      // 调用函数获取pinia state数据，必须在pinia加载后执行。
      const store = useMessageStore()
      const messageR = storeToRefs(store).messageS
      messageR.value = data.message ?? ''
      parseObject(resp.data.data)
      return resp
    }

    if (data.code >= 400) {
      // 调用函数获取pinia state数据，必须在pinia加载后执行。
      const store = useMessageStore()
      const messageR = storeToRefs(store).messageS
      messageR.value = data.message ?? ''
      return Promise.reject()
    }
    return resp
  },
  // 全局处理异常信息。即，http状态码不是200
  (error) => {
    const store = useMessageStore()
    const messageR = storeToRefs(store).messageS
    messageR.value = error.message ?? ''
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

    if (typeof value == 'string' && value.includes('{"')) {
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

export default axios
