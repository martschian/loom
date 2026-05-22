import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'
import {
  shouldPolyfillLocalStorage,
  testLocalStorage,
} from '@/test/storage'

// Node 22+ may expose a broken global localStorage when NODE_OPTIONS includes
// --localstorage-file without a valid path, which shadows jsdom's implementation.
if (shouldPolyfillLocalStorage) {
  vi.stubGlobal('localStorage', testLocalStorage)
}

beforeEach(() => {
  testLocalStorage.clear()
})
