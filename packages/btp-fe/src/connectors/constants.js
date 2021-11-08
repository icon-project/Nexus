import { connectedNetWorks } from 'utils/constants';

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
};

export const ADDRESS_LOCAL_STORAGE = 'address';
export const CONNECTED_WALLET_LOCAL_STORAGE = 'connected-wallet';

export const signingActions = {
  globalName: 'signingActions',
  transfer: 'transfer',
  bid: 'bid',
};

export const allowedNetworkIDs = {
  metamask: { '0x501': connectedNetWorks.moonbeam, '0x4': 'Rinkeby' },
};

const customNetworks = localStorage.getItem('NETWORK_CONFIG');
const { icon, moonbeam } = customNetworks ? JSON.parse(customNetworks) : { icon: {}, moonbeam: {} };

export const MOON_BEAM_NODE = {
  RPCUrl: moonbeam.endpoint || process.env.REACT_APP_MB_RPC_URL,
  BSHCore: moonbeam.BSHCore || process.env.REACT_APP_MB_BSH_CORE,
  networkAddress: moonbeam.networkAddress || process.env.REACT_APP_MB_NETWORK_ADDRESS,
  gasLimit: moonbeam.gasLimit || process.env.REACT_APP_MB_GAS_LIMIT,
};
console.log('MOON_BEAM_NODE', MOON_BEAM_NODE);

// https://www.icondev.io/docs/testnet
export const NETWORKS = {
  cloud: {
    name: connectedNetWorks.icon,
    endpoint: icon.endpoint || process.env.REACT_APP_ICON_RPC_URL,
    nid: icon.nid || process.env.REACT_APP_ICON_NID,
    networkAddress: icon.networkAddress || process.env.REACT_APP_ICON_NETWORK_ADDRESS,
    irc31token: icon.irc31token || process.env.REACT_APP_ICON_IRC31_TOKEN,
    BSHAddress: icon.BSHAddress || process.env.REACT_APP_ICON_BSH_ADDRESS, // used to get the BTP fee from getBTPfee()
  },
  sejong: {
    name: 'Sejong Testnet',
    endpoint: 'https://sejong.net.solidwallet.io/api/v3',
    nid: '0x53',
  },
  ICONMainnet: {
    name: 'ICON Mainnet',
    endpoint: 'https://ctz.solidwallet.io/api/v3',
    nid: '1',
  },
};
console.log('ICON_NODE', NETWORKS.cloud);

const testnet = localStorage.getItem('dev');
export const currentICONexNetwork =
  (testnet ? NETWORKS[testnet] : NETWORKS.cloud) || NETWORKS.cloud;
