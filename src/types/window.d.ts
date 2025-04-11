interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (args: any) => void) => void;
  removeListener: (eventName: string, handler: (args: any) => void) => void;
  isMetaMask?: boolean;
  isConnected: () => boolean;
  selectedAddress: string | null;
  networkVersion: string;
  chainId: string;
}

interface MultiversXProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (args: any) => void) => void;
  removeListener: (eventName: string, handler: (args: any) => void) => void;
  isMultiversX?: boolean;
  isConnected: () => boolean;
  selectedAddress: string | null;
  networkVersion: string;
  chainId: string;
}

interface Window {
  ethereum?: EthereumProvider;
  multiversx?: MultiversXProvider;
}

interface EthereumError {
  code: number;
  message: string;
  data?: any;
}

declare module 'ethers' {
  interface Contract {
    signer: {
      getAddress: () => Promise<string>;
    };
  }
} 