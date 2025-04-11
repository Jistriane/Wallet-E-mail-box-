declare module '@multiversx/sdk-core' {
  export interface NetworkConfig {
    id: string;
    name: string;
    egldLabel: string;
    decimals: string;
    gasPerDataByte: string;
    walletAddress: string;
    apiAddress: string;
    explorerAddress: string;
    chainId: string;
  }
}

declare module '@multiversx/sdk-wallet' {
  export class UserWallet {
    static fromMnemonic(mnemonic: string): UserWallet;
    getAddress(): string;
    signTransaction(transaction: any): Promise<string>;
    signMessage(message: string): Promise<string>;
  }
}

declare module '@multiversx/sdk-network-providers' {
  export class ApiNetworkProvider {
    constructor(url: string);
    getAccount(address: string): Promise<any>;
    getNetworkConfig(): Promise<any>;
    sendTransaction(signedTransaction: string): Promise<any>;
  }
} 