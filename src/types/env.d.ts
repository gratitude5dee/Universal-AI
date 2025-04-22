
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CROSSMINT_CLIENT_KEY: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add declaration for global Buffer
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
