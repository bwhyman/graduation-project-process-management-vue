import { createElLoading } from '@/components/loading'
import type { Ref } from 'vue'

/**
 *
 * @param dataR 缓存对象
 * @param replace 默认值false，基于缓存决定是否执行业务方法；true，执行业务方法，并将结果置于缓存
 * @returns 缓存对象，或更新后的缓存对象
 */
export function StoreCache(dataR: Ref<any>, replace = false) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      const val = dataR.value
      // 响应式对象存在，直接返回
      if (!replace && val) {
        return Promise.resolve(dataR)
      }
      // 异步执行目标方法并将结果置于store
      const r = await originalMethod.apply(descriptor, args)
      return (dataR.value = r) && dataR
    }
    return descriptor
  }
}

/**
 *
 * @param dataR 封装Map类型的响应式对象
 * @param indexs 用于拼接Map键的方法参数索引位置。默认按方法参数顺序拼接键
 * @returns Map中proxy类型元素
 */
export function StoreMapCache(dataR: Ref<Map<any, any>>, indexs?: number[]) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      const val = dataR.value
      let mapKey = args.join('-')
      if (indexs) {
        const temp = []
        for (const index of indexs) {
          temp.push(args[index])
        }
        mapKey = temp.join('-')
      }
      const mapValue = val.get(mapKey)
      // 响应式对象存在，直接返回
      if (mapValue) {
        return Promise.resolve(mapValue)
      }
      // 响应式对象不存在。异步执行目标方法并将结果置于store
      const r = await originalMethod.apply(descriptor, args)
      val.set(mapKey, r)
      return val.get(mapKey)
    }
    return descriptor
  }
}

// 注入clear函数数组
export function StoreClear(...clears: Function[]) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = (...args: any[]) => {
      for (const clear of clears) {
        clear()
      }
      return originalMethod.apply(descriptor, args)
    }
    return descriptor
  }
}

export function ELLoading() {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async (...args: any[]) => {
      let r
      const loading = createElLoading()
      try {
        r = await originalMethod.apply(descriptor, args)
      } finally {
        loading.close()
      }
      return r
    }
    return descriptor
  }
}
