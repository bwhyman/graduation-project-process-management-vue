import axios from '@/axios'
import type { ProcessFile, ResultVO } from '@/types'

//
export const uploadFileService = async (
  pid: string,
  num: number,
  encoder: string,
  fdata: FormData
) => {
  const resp = await axios.post<ResultVO<{ processfiles: ProcessFile[] }>>(
    `student/upload/${pid}/numbers/${num}`,
    fdata,
    { headers: { xtoken: encoder } }
  )
  return resp.data.data?.processfiles ?? []
}
//
export const listProcessFilesService = async (pid: string) => {
  const resp = await axios.get<ResultVO<{ processfiles: ProcessFile[] }>>(
    `student/processfiles/${pid}`
  )

  return resp.data.data?.processfiles ?? []
}

// 摘要
export const uploadFileSignatureService = async (msg: string) => {
  return window.btoa(window.encodeURIComponent(msg)).substring(0, 10)
}
