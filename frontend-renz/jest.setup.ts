import "@testing-library/jest-dom"

if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, "crypto", {
    value: { ...globalThis.crypto, randomUUID: () => Math.random().toString(36).slice(2) },
    configurable: true,
  })
}

// Polyfill Blob.prototype.arrayBuffer for jsdom environments that lack it
if (!Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function () {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(this)
    })
  }
}
