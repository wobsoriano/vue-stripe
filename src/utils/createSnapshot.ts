import { toRaw } from 'vue'
import { isUnknownObject } from './guards'

const PLAIN_OBJECT_STR = '[object Object]'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return isUnknownObject(value) && Object.prototype.toString.call(value) === PLAIN_OBJECT_STR
}

export function createSnapshot<T>(value: T): T {
  const rawValue = isUnknownObject(value) ? toRaw(value) : value

  if (Array.isArray(rawValue)) {
    return rawValue.map(item => createSnapshot(item)) as T
  }

  if (isPlainObject(rawValue)) {
    return Object.keys(rawValue).reduce((snapshot, key) => {
      snapshot[key] = createSnapshot(rawValue[key])
      return snapshot
    }, {} as Record<string, unknown>) as T
  }

  return rawValue
}
