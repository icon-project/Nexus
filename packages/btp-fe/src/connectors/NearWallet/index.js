import * as nearAPI from 'near-api-js';
import { NEAR_NODE } from 'connectors/constants';
import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';

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

    account.setAccountInfo({
      address: accountInfo.accountId,
      balance: ethers.utils.formatUnits(balance.total, 24),
      wallet: wallets.near,
      symbol: 'NEAR',
      currentNetwork: 'NEAR',
    });
  }
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
  await contract.transfer(
    {
      coin_name: 'NEAR',
      destination: 'btp://0x2.icon/' + to,
      amount: nearAPI.utils.format.parseNearAmount(value),
    },
    '300000000000000',
  );
};

export const getTxStatus = async (txHash) => {
  const wallet = await getWalletInstance();
  const provider = new nearAPI.providers.JsonRpcProvider(NEAR_NODE.nodeUrl);

  const result = await provider.txStatus(txHash, wallet.getAccountId());
  console.log('Result: ', result);
};
