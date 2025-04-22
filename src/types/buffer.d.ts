
/// <reference types="node" />

declare module 'buffer' {
  export const Buffer: typeof global.Buffer;
}

// Add declaration for global Buffer
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
