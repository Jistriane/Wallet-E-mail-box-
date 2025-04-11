/// <reference types="vite/client" />
/// <reference types="@chakra-ui/react" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '@chakra-ui/react' {
  export * from '@chakra-ui/react';
}

declare module 'react' {
  export * from 'react';
}

declare module 'react-dom' {
  export * from 'react-dom';
}

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_API_KEY: string
  readonly VITE_NETWORK: string
  readonly VITE_CHAIN_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
} 