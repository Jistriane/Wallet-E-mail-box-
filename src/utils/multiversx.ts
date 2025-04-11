import { UserWallet } from '@multiversx/sdk-wallet';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { MULTIVERSX_PROVIDER_URL } from '../config/multiversx';

export const createWallet = (mnemonic: string): UserWallet => {
  return UserWallet.fromMnemonic(mnemonic);
};

export const getProvider = (): ApiNetworkProvider => {
  return new ApiNetworkProvider(MULTIVERSX_PROVIDER_URL);
};

export const formatAmount = (amount: string): string => {
  return (Number(amount) / 1e18).toString();
};

export const parseAmount = (amount: string): string => {
  return (Number(amount) * 1e18).toString();
}; 