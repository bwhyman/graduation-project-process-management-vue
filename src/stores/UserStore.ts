import type { User } from '@/types'

const textCoder = new TextEncoder()
const textDecoder = new TextDecoder()

const asc = (str: string) => str.replace(/20/g, '=').replace(/3/g, '/').replace(/6/g, 'x')
const dasc = (str: string) => str.replace(/=/g, '20').replace(/\//g, '3').replace(/x/g, '6')

const encode = (str: string) => {
  const deResult: string[] = []
  textCoder.encode(str).forEach((r) => {
    deResult.push(r.toString(17))
  })
  return asc(deResult.join(''))
}

const decode = (str: string) => {
  const dascStr = dasc(str)
  const deResult: number[] = []
  for (let i = 0; i < dascStr.length; i += 2) {
    const st0 = dasc(dascStr[i])
    const st1 = dasc(dascStr[i + 1])
    deResult.push(parseInt(`${st0}${st1}`, 17))
  }
  return textDecoder.decode(new Uint8Array(deResult))
}

const u = sessionStorage.getItem('user')
const userS = ref<User>()
u && (userS.value = JSON.parse(decode(u)))

const setUserSessionStorage = (user: User, role: string) => {
  userS.value = user
  sessionStorage.setItem('role', role)
  sessionStorage.setItem('user', encode(JSON.stringify(user)))
}
export const useUserStore = () => {
  return { userS, setUserSessionStorage }
}
