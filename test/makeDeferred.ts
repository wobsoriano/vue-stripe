import { vi } from 'vitest'

function makeDeferred<T>() {
  let resolve!: (arg: T) => void
  let reject!: (arg: any) => void
  const promise: Promise<T> = new Promise((res: any, rej: any) => {
    resolve = vi.fn(res)
    reject = vi.fn(rej)
  })
  return {
    resolve: async (arg: T) => {
      resolve(arg)
      await new Promise(process.nextTick)
    },
    reject: async (failure: any) => {
      reject(failure)
      await new Promise(process.nextTick)
    },
    promise,
    getPromise: vi.fn(() => promise),
  }
}
export default makeDeferred
