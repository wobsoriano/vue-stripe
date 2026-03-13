import { vi } from 'vite-plus/test'

function makeDeferred<T>() {
  let resolve!: (arg: T) => void
  let reject!: (arg: any) => void
  const nextTick = () => new Promise<void>((resolve) => process.nextTick(resolve))
  const promise: Promise<T> = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {
    resolve: async (arg: T) => {
      resolve(arg)
      await nextTick()
    },
    reject: async (failure: any) => {
      reject(failure)
      await nextTick()
    },
    promise,
    getPromise: vi.fn(() => promise),
  }
}
export default makeDeferred
