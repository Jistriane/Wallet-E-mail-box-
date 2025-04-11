/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_API_KEY: string;
  readonly VITE_EMAIL_CONTRACT_ADDRESS: string;
  readonly VITE_NETWORK: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_ENABLE_EMAIL_SYSTEM: string;
  readonly VITE_ENABLE_TOKEN_SUPPORT: string;
  readonly VITE_ENABLE_METAMASK: string;
  readonly VITE_THEME: string;
  readonly VITE_LANGUAGE: string;
  readonly VITE_ENABLE_2FA: string;
  readonly VITE_ENABLE_BACKUP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv extends ImportMetaEnv {}
} 