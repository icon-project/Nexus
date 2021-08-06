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
  metamask: { '0x507': 'Moonbase Alpha', '0x4': 'Rinkeby' },
};

// https://www.icondev.io/docs/testnet
export const NETWORKS = {
  cloud: {
    name: 'Custom ICON node',
    endpoint: 'http://54.251.114.18:9080/api/v3',
    nid: 3,
    BSHAddress: 'cxd42ef4864c64f0cd793018e06eed190b46492a1c', // used to get the BTP fee from getBTPfee()
  },
  yeouido: {
    name: 'Yeouido Testnet',
    endpoint: 'https://bicon.net.solidwallet.io/api/v3',
    nid: '3',
  },
  hannam: {
    name: 'Hannam Testnet',
    endpoint: 'https://hannam.net.solidwallet.io/api/v3',
    nid: '3',
  },
  euljiro: {
    name: 'Euljiro Testnet',
    endpoint: 'https://test-ctz.solidwallet.io/api/v3',
    nid: '2',
  },
  pagoda: {
    name: 'Pagoda Testnet',
    endpoint: 'https://zicon.net.solidwallet.io/api/v3',
    nid: '80',
  },
  gangnam: {
    name: 'Gangnam Testnet',
    endpoint: 'https://gicon.net.solidwallet.io/api/v3',
    nid: '0x7',
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
