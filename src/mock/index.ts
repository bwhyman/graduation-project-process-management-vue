import { createServer, Response } from 'miragejs'
import type { ResultVO, User } from '@/types'
import * as consty from '@/services/Const'

const server = createServer({})
server.namespace = 'api'

server.post('login', (_, request) => {
  // 从请求对象中获取参数，反序列化为JS对象。解构
  const { number, password } = JSON.parse(request.requestBody)

  const resultVO: ResultVO<{ user: User }> = { code: 200, data: { user: {} } }
  if (number == 'admin' && password == 'admin') {
    resultVO.data = { user: { name: 'admin' } }
    return new Response(
      200,
      {
        token:
          '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6'
      },
      resultVO
    )
  }
  resultVO.code = 401
  resultVO.message = '用户名密码错误'
  return resultVO
})

//
server.put('admin/starttime/:time', (_, request) => {
  console.log(request.params.time)
  const resultVO: ResultVO<{}> = { code: 200, data: {} }
  return new Response(200, {}, resultVO)
})

//
server.put('admin/passwords/:pwd', (_, request) => {
  console.log(request.params.pwd)
  const resultVO: ResultVO<{}> = { code: 200, data: {} }
  return new Response(200, {}, resultVO)
})
