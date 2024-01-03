<script setup lang="ts">
import { listProcessesService } from '@/services'
import HeaderView from './header/IndexView.vue'

// 加载过程信息
await listProcessesService()

// // 生成椭圆曲线密钥对
// const keyPair = await window.crypto.subtle.generateKey(
//   {
//     name: 'ECDSA',
//     namedCurve: 'P-256'
//   },
//   true,
//   ['sign', 'verify']
// )

// console.log(keyPair)
// const publicKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey)
// console.log(publicKeyJwk)
// const privateKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey)
// console.log(privateKeyJwk)

// const cryptoF = async () => {
//   const encoder = new TextEncoder()
//   const data = encoder.encode('hello')
//   const sugnature = await window.crypto.subtle.sign(
//     {
//       name: 'ECDSA',
//       hash: { name: 'SHA-256' }
//     },
//     keyPair.privateKey,
//     data
//   )
//   console.log(sugnature)
//   return sugnature
// }
// const sign = await cryptoF()

// const verifySignature = async () => {
//   const encoder = new TextEncoder()
//   const data = encoder.encode('a')

//   const isVerified = await window.crypto.subtle.verify(
//     {
//       name: 'ECDSA',
//       hash: { name: 'SHA-256' }
//     },
//     keyPair.publicKey,
//     sign,
//     data
//   )
//   return isVerified
// }
// const result = await verifySignature()
// console.log(result)
</script>
<template>
  <HeaderView />
  <RouterView />
</template>
