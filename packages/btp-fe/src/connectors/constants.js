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

// https://www.icondev.io/docs/testnet
export const NETWORKS = {
  dev: {
    name: 'Local',
    endpoint: 'http://localhost:9080/api/v3/src',
  },
  yeouido: {
    name: 'Yeouido Testnet',
    endpoint: 'https://bicon.net.solidwallet.io/api/v3',
  },
  hannam: {
    name: 'Hannam Testnet',
    endpoint: 'https://hannam.net.solidwallet.io/api/v3',
  },
  euljiro: {
    name: 'Euljiro Testnet',
    endpoint: 'https://test-ctz.solidwallet.io/api/v3',
  },
  pagoda: {
    name: 'Pagoda Testnet',
    endpoint: 'https://zicon.net.solidwallet.io/api/v3',
  },
  gangnam: {
    name: 'Gangnam Testnet',
    endpoint: 'https://gicon.net.solidwallet.io/api/v3',
  },
  sejong: {
    name: 'Sejong Testnet',
    endpoint: 'https://sejong.net.solidwallet.io/api/v3',
  },
  ICONMainnet: {
    name: 'ICON Mainnet',
    endpoint: 'https://ctz.solidwallet.io/api/v3',
  },
};

const testnet = localStorage.getItem('dev');
export const currentICONexNetwork = testnet ? NETWORKS[testnet] : NETWORKS.sejong;
