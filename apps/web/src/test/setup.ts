import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'
import {
  shouldPolyfillLocalStorage,
  testLocalStorage,
} from '@/test/storage'

// Node 22+ (esp. Windows installer) may expose a broken global localStorage that
// shadows jsdom — e.g. missing clear() when --localstorage-file is invalid.
if (shouldPolyfillLocalStorage) {
  vi.stubGlobal('localStorage', testLocalStorage)
}

beforeEach(() => {
  testLocalStorage.clear()
})
