import IconService, { HttpProvider } from 'icon-sdk-js';
import { connectedNetWorks } from 'utils/constants';
import { chainConfigs } from 'connectors/chainConfigs';

// https://www.icondev.io/iconex-connect/chrome-extension#methods
export const TYPES = {
  REQUEST_HAS_ACCOUNT: 'REQUEST_HAS_ACCOUNT',
  RESPONSE_HAS_ACCOUNT: 'RESPONSE_HAS_ACCOUNT',
  REQUEST_ADDRESS: 'REQUEST_ADDRESS',
  RESPONSE_ADDRESS: 'RESPONSE_ADDRESS',
  REQUEST_HAS_ADDRESS: 'REQUEST_HAS_ADDRESS',
  RESPONSE_HAS_ADDRESS: 'RESPONSE_HAS_ADDRESS',
  REQUEST_SIGNING: 'REQUEST_SIGNING',
  RESPONSE_SIGNING: 'RESPONSE_SIGNING',
  CANCEL_SIGNING: 'CANCEL_SIGNING',
  REQUEST_JSON_RPC: 'REQUEST_JSON-RPC',
  RESPONSE_JSON_RPC: 'RESPONSE_JSON-RPC',
  CANCEL_JSON_RPC: 'CANCEL_JSON-RPC',
};

export const ADDRESS_LOCAL_STORAGE = 'address';
export const CONNECTED_WALLET_LOCAL_STORAGE = 'connected-wallet';

export const signingActions = {
  globalName: 'signingActions',
  transfer: 'transfer',
  bid: 'bid',
  deposit: 'deposit',
  receiver: 'receiver',
  approve: 'approve',
};

export const rawTransaction = 'rawTransaction';

export const allowedNetworkIDs = {
  metamask: {
    '0x507': connectedNetWorks.moonbeam,
    '0x61': connectedNetWorks.bsc,
    '0x4': 'Rinkeby',
  },
};

export const NEAR_NODE = {
  [connectedNetWorks.near]: true,
  networkId: process.env.REACT_APP_NEAR_NETWORK_ID,
  contractId: process.env.REACT_APP_NEAR_CONTRACT_ID,
  nodeUrl: process.env.REACT_APP_NEAR_NODE_URL,
  walletUrl: process.env.REACT_APP_NEAR_WALLET_URL,
  helperUrl: process.env.REACT_APP_NEAR_HELPER_URL,
  explorerUrl: process.env.REACT_APP_NEAR_EXPLORER_URL,
};

export const BSC_NODE = {
  [connectedNetWorks.bsc]: true,
  RPCUrl: process.env.REACT_APP_BSC_RPC_URL,
  networkAddress: process.env.REACT_APP_BSC_NETWORK_ADDRESS,
  BSHCore: process.env.REACT_APP_BSC_BSH_CORE,
  tokenBSHProxy: process.env.REACT_APP_BSC_TOKEN_BSH_PROXY,
  BEP20TKN: process.env.REACT_APP_BSC_BEP20_TKN,
};

export const MOON_BEAM_NODE = {
  [connectedNetWorks.moonbeam]: true,
  RPCUrl: process.env.REACT_APP_MB_RPC_URL,
  BSHCore: process.env.REACT_APP_MB_BSH_CORE,
  BSHICX: process.env.REACT_APP_MB_BSH_ICX,
  networkAddress: process.env.REACT_APP_MB_NETWORK_ADDRESS,
  gasLimit: process.env.REACT_APP_MB_GAS_LIMIT,
};

if (process.env.JEST_WORKER_ID === undefined) {
  console.log('BSC_NODE', BSC_NODE);
  console.log('MOON_BEAM_NODE', MOON_BEAM_NODE);
}

export const serverEndpoint = process.env.REACT_APP_BTP_ENDPOINT;
export const httpProvider = new HttpProvider(chainConfigs.ICON?.RPC_URL);
export const iconService = new IconService(httpProvider);
