/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add more env variables here if you have
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}