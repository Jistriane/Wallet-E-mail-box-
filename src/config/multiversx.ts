import { NetworkConfig } from '@multiversx/sdk-core';

export const MULTIVERSX_CONFIG: NetworkConfig = {
  id: 'devnet',
  name: 'devnet',
  egldLabel: 'xEGLD',
  decimals: '18',
  gasPerDataByte: '1500',
  walletAddress: 'https://devnet-wallet.multiversx.com',
  apiAddress: 'https://devnet-api.multiversx.com',
  explorerAddress: 'https://devnet-explorer.multiversx.com',
  chainId: 'D',
};

export const MULTIVERSX_PROVIDER_URL = import.meta.env.VITE_MULTIVERSX_API_URL || 'https://devnet-api.multiversx.com'; 