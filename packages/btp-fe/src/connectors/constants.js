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
export const METAMASK_LOCAL_ADDRESS = 'metamask-address';

export const signingActions = {
  globalName: 'signingActions',
  transfer: 'transfer',
  bid: 'bid',
};

export const allowedNetworkIDs = {
  metamask: { '0x501': 'Moonbase Alpha', '0x4': 'Rinkeby' },
};

export const MOON_BEAM_NODE = {
  RPCUrl: 'http://54.251.114.18:9933',
  BSHCore: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  networkAddress: '0x501.pra',
  gasLimit: '6691B7',
};

// https://www.icondev.io/docs/testnet
export const NETWORKS = {
  cloud: {
    name: 'Custom ICON node',
    endpoint: 'http://54.251.114.18:9080/api/v3',
    nid: 3,
    networkAddress: '0x3.icon',
    BSHAddress: 'cx22722ffbc83d57d78e937bb32fa16a84609f6b82', // used to get the BTP fee from getBTPfee()
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

const testnet = localStorage.getItem('dev');
export const currentICONexNetwork =
  (testnet ? NETWORKS[testnet] : NETWORKS.cloud) || NETWORKS.cloud;
