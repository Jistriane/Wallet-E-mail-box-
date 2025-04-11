declare module 'ethers' {
  export interface Wallet {
    address: string;
    mnemonic?: { phrase: string };
    signMessage(message: string): Promise<string>;
    signTransaction(transaction: any): Promise<string>;
    connect(provider: Provider): Wallet;
  }

  export interface Provider {
    getBalance(address: string): Promise<bigint>;
    getTransactionCount(address: string): Promise<number>;
    getFeeData(): Promise<{ gasPrice: bigint }>;
    getCode(address: string): Promise<string>;
    broadcastTransaction(signedTx: string): Promise<{ hash: string; wait(): Promise<any> }>;
  }

  export interface Contract {
    signer: {
      getAddress(): Promise<string>;
    };
    send_email(to: string, subject: string, content: string): Promise<{ hash: string; wait(): Promise<any> }>;
    get_inbox(address: string): Promise<any[]>;
    get_sent(address: string): Promise<any[]>;
    get_spam_list(address: string): Promise<string[]>;
    mark_as_read(index: number): Promise<{ wait(): Promise<any> }>;
    delete_email(index: number): Promise<{ wait(): Promise<any> }>;
    add_to_spam(address: string): Promise<{ wait(): Promise<any> }>;
    remove_from_spam(address: string): Promise<{ wait(): Promise<any> }>;
    verify_email_integrity(address: string, index: number): Promise<boolean>;
  }

  export class BrowserProvider implements Provider {
    constructor(ethereum: any);
    getBalance(address: string): Promise<bigint>;
    getTransactionCount(address: string): Promise<number>;
    getFeeData(): Promise<{ gasPrice: bigint }>;
    getCode(address: string): Promise<string>;
    broadcastTransaction(signedTx: string): Promise<{ hash: string; wait(): Promise<any> }>;
    getSigner(): Promise<{ getAddress(): Promise<string> }>;
  }

  export class JsonRpcProvider implements Provider {
    constructor(url: string);
    getBalance(address: string): Promise<bigint>;
    getTransactionCount(address: string): Promise<number>;
    getFeeData(): Promise<{ gasPrice: bigint }>;
    getCode(address: string): Promise<string>;
    broadcastTransaction(signedTx: string): Promise<{ hash: string; wait(): Promise<any> }>;
  }

  export function isAddress(address: string): boolean;
  export function formatEther(value: bigint): string;
  export function parseEther(value: string): bigint;
  export function parseUnits(value: string, unit: string): bigint;

  export const Wallet: {
    createRandom(): Wallet;
    fromPhrase(phrase: string): Wallet;
  };

  export const Contract: {
    new (address: string, abi: any[], signerOrProvider: any): Contract;
  };
} 