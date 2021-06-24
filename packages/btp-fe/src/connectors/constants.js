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

// https://www.icondev.io/docs/testnet
export const NETWORKS = {
  dev: {
    name: 'Local',
    endpoint: 'http://localhost:9080/api/v3/src',
    nid: localStorage.getItem('nid') || '0xc7c937',
  },
  cloud: {
    name: 'Cloud',
    endpoint: 'http://54.251.114.18:9082/api/v3',
    nid: 3,
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
