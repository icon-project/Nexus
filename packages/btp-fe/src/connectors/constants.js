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
  RPCUrl: moonbeam.endpoint || 'http://54.251.114.18:9933',
  BSHCore: moonbeam.BSHCore || '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  networkAddress: moonbeam.networkAddress || '0x501.pra',
  gasLimit: moonbeam.gasLimit || '6691B7',
};
console.log('MOON_BEAM_NODE', MOON_BEAM_NODE);

// https://www.icondev.io/docs/testnet
export const NETWORKS = {
  cloud: {
    name: connectedNetWorks.icon,
    endpoint: icon.endpoint || 'http://54.251.114.18:9080/api/v3',
    nid: icon.nid || '0x58eb1c',
    networkAddress: icon.networkAddress || '0x58eb1c.icon',
    irc31token: icon.irc31token || 'cxbac7add3adffb4ca43426ede92662da7dcc0453f',
    BSHAddress: icon.BSHAddress || 'cx489ed02580ce5cab57925317373310205417c2b7', // used to get the BTP fee from getBTPfee()
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
