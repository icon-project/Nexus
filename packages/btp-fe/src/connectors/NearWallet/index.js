import * as nearAPI from 'near-api-js';
import { NEAR_NODE } from 'connectors/constants';
import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';
import { customzeChain } from 'connectors/chainConfigs';

const { account } = store.dispatch;

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

export const connect = async () => {
  const wallet = await getWalletInstance();
  if (!wallet.isSignedIn()) {
    wallet.requestSignIn(
      NEAR_NODE.contractId, // contract requesting access
      null,
      location.href + '?near=true',
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
    customzeChain('NEAR');

    account.setAccountInfo({
      address: accountInfo.accountId,
      balance: ethers.utils.formatUnits(balance.total, 24),
      wallet: wallets.near,
      symbol: 'NEAR',
      currentNetwork: 'NEAR',
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

  await contract.deposit({}, '300000000000000', nearAPI.utils.format.parseNearAmount(amount));
};

export const transfer = async ({ value, to }) => {
  console.log('🚀 ~ file: index.js ~ line 71 ~ transfer ~ to', to);
  console.log('🚀 ~ file: index.js ~ line 71 ~ transfer ~ value', value);
  const wallet = await getWalletInstance();
  // https://github.com/near-examples/guest-book
  // https://explorer.testnet.near.org/accounts/guest-book.testnet
  const contract = await new nearAPI.Contract(
    // User's accountId as a string
    wallet.account(),
    // accountId of the contract we will be loading
    // NOTE: All contracts on NEAR are deployed to an account and
    // accounts can only have one contract deployed to them.
    NEAR_NODE.contractId,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: [],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ['transfer'],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: wallet.getAccountId(),
    },
  );
  const result = await contract.transfer(
    {
      coin_id: [
        247,
        184,
        188,
        27,
        185,
        62,
        246,
        213,
        77,
        228,
        101,
        193,
        206,
        130,
        171,
        233,
        39,
        148,
        195,
        217,
        177,
        33,
        141,
        212,
        41,
        223,
        44,
        241,
        83,
        209,
        37,
        217,
      ],
      destination: 'btp://0x2.icon/' + to,
      amount: nearAPI.utils.format.parseNearAmount(value),
    },
    '300000000000000',
  );
  console.log('🚀 ~ file: index.js ~ line 145 ~ transfer ~ result', result);
};

export const functionCall = async () => {
  const wallet = await getWalletInstance();

  const response = await wallet.account().functionCall({
    contractId: NEAR_NODE.contractId,
    methodName: 'transfer',
    args: {
      coin_id: [
        247,
        184,
        188,
        27,
        185,
        62,
        246,
        213,
        77,
        228,
        101,
        193,
        206,
        130,
        171,
        233,
        39,
        148,
        195,
        217,
        177,
        33,
        141,
        212,
        41,
        223,
        44,
        241,
        83,
        209,
        37,
        217,
      ],
      destination: 'btp://0x2.icon/hx6d338536ac11a0a2db06fb21fe8903e617a6764d',
      amount: nearAPI.utils.format.parseNearAmount('0.1'),
    },
    gas: '300000000000000',
  });
  console.log('🚀 ~ file: index.js ~ line 154 ~ response ~ response', response);
};

export const getTxStatus = async (txHash) => {
  const wallet = await getWalletInstance();
  const provider = new nearAPI.providers.JsonRpcProvider(NEAR_NODE.nodeUrl);

  const result = await provider.txStatus(txHash, wallet.getAccountId());
  console.log('Result: ', result);
};
