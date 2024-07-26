export const createElLoading = (msg: string = 'Loading') => {
  return ElLoading.service({
    lock: true,
    text: msg,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
