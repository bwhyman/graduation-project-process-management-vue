import axios, { useGet } from '@/axios'
import type { ProcessFile, ResultVO } from '@/types'

const STUDENT = 'student'

//
export const uploadFileService = async (
  pid: string,
  num: number,
  encoder: string,
  fdata: FormData
) => {
  const resp = await axios.post<ResultVO<ProcessFile[]>>(
    `${STUDENT}/upload/${pid}/numbers/${num}`,
    fdata,
    { headers: { xtoken: encoder } }
  )
  return resp.data.data
}
//
export const listProcessFilesService = async (pid: string) => {
  const data = await useGet<ProcessFile[]>(`${STUDENT}/processfiles/${pid}`)

  return data
}

// 摘要
export const uploadFileSignatureService = async (msg: string) => {
  return window.btoa(window.encodeURIComponent(msg)).substring(0, 10)
}
