import * as nearAPI from 'near-api-js';
import { NEAR_NODE } from 'connectors/constants';
import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';

const { account, modal } = store.dispatch;

export const handleNEARCallback = (location, address) => {
  const { search, pathname } = location;

  switch (true) {
    // https://docs.near.org/docs/api/naj-quick-reference#sign-in
    // handle NEAR wallet connecting
    case search.startsWith('?near=true'):
      if (address) window.history.replaceState(null, '', pathname);
      break;
    case search.startsWith('?near=false'):
      window.history.replaceState(null, '', pathname);
      modal.openModal({
        icon: 'exclamationPointIcon',
        desc: 'Wallet rejected.',
        button: {
          text: 'Dismiss',
          onClick: () => modal.setDisplay(false),
        },
      });
      break;
    default:
      break;
  }
};

const getNearInstance = async () =>
  nearAPI.connect({
    ...NEAR_NODE,
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  });

const getWalletInstance = async (near) => {
  const nearIntance = near || (await getNearInstance());
  return new nearAPI.WalletConnection(nearIntance);
};

const getAccountInstance = async () => {
  const near = await getNearInstance();
  const wallet = await getWalletInstance(near);
  const account = await near.account(wallet.getAccountId());

  return account;
};

export const getContractInstance = async () => {
  const wallet = await getWalletInstance();

  return await new nearAPI.Contract(wallet.account(), {
    viewMethods: ['balance_of', 'ft_balance_of'],
    changeMethods: ['deposit'],
    sender: wallet.getAccountId(),
  });
};

export const connect = async () => {
  const wallet = await getWalletInstance();
  if (!wallet.isSignedIn()) {
    wallet.requestSignIn(
      NEAR_NODE.contractId, // contract requesting access
      null,
      location.href + '?near=true',
      location.href + '?near=false',
    );
  }
};

export const signOut = async () => {
  const wallet = await getWalletInstance();
  wallet.signOut();
};

export const getBalanceOf = async (options) => {
  const { refundable } = options || {};

  if (refundable) {
    return Promise.resolve(0); // TODO: implementation
  }
  const account = await getAccountInstance();
  return account.getAccountBalance();
};

export const getNearAccountInfo = async () => {
  const wallet = await getWalletInstance();
  if (wallet && wallet.isSignedIn()) {
    const accountInfo = await getAccountInstance();
    const balance = await getBalanceOf();
    const id = 'NEAR';

    account.setAccountInfo({
      address: accountInfo.accountId,
      balance: ethers.utils.formatUnits(balance.total, 24),
      wallet: wallets.near,
      symbol: id,
      currentNetwork: id,
      id,
    });
  }
};

export const deposit = async (amount) => {
  const wallet = await getWalletInstance();
  const contract = await new nearAPI.Contract(wallet.account(), NEAR_NODE.contractId, {
    viewMethods: [],
    changeMethods: ['deposit'],
    sender: wallet.getAccountId(),
  });

  return await contract.deposit(
    {},
    '300000000000000',
    nearAPI.utils.format.parseNearAmount(amount),
  );
};

export const transfer = async ({ value, to }) => {
  const depositResult = await deposit(value);
  console.log('🚀 ~ file: index.js ~ line 97 ~ transfer ~ depositResult', depositResult);
  const transferResult = await functionCall('transfer', {
    coin_name: 'btp-0x1.near-NEAR',
    destination: 'btp://0x2.icon/' + to,
    amount: nearAPI.utils.format.parseNearAmount(value),
  });
  console.log('🚀 ~ file: index.js ~ line 108 ~ transfer ~ transferResult', transferResult);
};

export const functionCall = async (methodName, args) => {
  const wallet = await getWalletInstance();
  return await wallet.account().functionCall({
    contractId: NEAR_NODE.contractId,
    methodName,
    args,
    gas: '300000000000000',
  });
};

export const getTxStatus = async (txHash) => {
  const wallet = await getWalletInstance();
  const provider = new nearAPI.providers.JsonRpcProvider(NEAR_NODE.nodeUrl);

  const result = await provider.txStatus(txHash, wallet.getAccountId());
  console.log('Result: ', result);
};

export const getBalance = async () => {
  const wallet = await getWalletInstance();
  const contract = await new nearAPI.Contract(wallet.account(), 'btp-icx.bts.iconbridge.testnet', {
    viewMethods: ['ft_balance_of'],
    changeMethods: [],
    sender: wallet.getAccountId(),
  });

  const result = await contract.ft_balance_of({
    account_id: wallet.getAccountId(),
    // coin_name: 'btp-0x2.icon-ICX',
  });
  console.log('🚀 ~ file: index.js ~ line 219 ~ getBalance ~ result', result);
};

export const getUsableBalance = async () => {
  const wallet = await getWalletInstance();
  const contract = await new nearAPI.Contract(wallet.account(), NEAR_NODE.contractId, {
    viewMethods: ['balance_of'],
    changeMethods: [],
    sender: wallet.getAccountId(),
  });

  const result = await contract.balance_of({
    account_id: wallet.getAccountId(),
    coin_name: 'btp-0x2.icon-ICX',
  });
  console.log('🚀 ~ file: index.js ~ line 219 ~ getBalance ~ result', result);
};
