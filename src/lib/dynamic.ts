import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export const dynamicConfig = {
  environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
  walletConnectors: [EthereumWalletConnectors],
  evmNetworks: [
    {
      blockExplorerUrls: ['https://seitrace.com'],
      chainId: 1329,
      chainName: 'Sei',
      iconUrls: [],
      name: 'Sei',
      nativeCurrency: {
        decimals: 18,
        name: 'SEI',
        symbol: 'SEI',
      },
      networkId: 1329,
      rpcUrls: ['https://evm-rpc.sei-apis.com'],
    },
  ],
};