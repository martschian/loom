/** In-memory Storage for Vitest when Node's experimental localStorage is broken. */
export function createMemoryStorage(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
  }
}

function isStorageUsable(storage: Storage | undefined): storage is Storage {
  if (!storage) return false
  return (
    typeof storage.getItem === 'function' &&
    typeof storage.setItem === 'function' &&
    typeof storage.clear === 'function'
  )
}

const native = globalThis.localStorage

export const testLocalStorage = isStorageUsable(native)
  ? native
  : createMemoryStorage()

export const shouldPolyfillLocalStorage = !isStorageUsable(native)
