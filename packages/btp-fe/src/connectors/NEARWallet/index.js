import * as nearAPI from 'near-api-js';
import { NEAR_NODE } from 'connectors/constants';
import { ethers } from 'ethers';
import store from 'store';
import { connectedNetWorks, nativeTokens, wallets } from 'utils/constants';

const { account } = store.dispatch;

const getNearInstance = async () =>
  nearAPI.connect({
    ...NEAR_NODE,
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  });

const getWalletInstance = async (near) => {
  if (near) {
    return new nearAPI.WalletConnection(near);
  }
  const nearIntance = await getNearInstance();
  return new nearAPI.WalletConnection(nearIntance);
};

export const connect = async () => {
  const wallet = await getWalletInstance();
  wallet.requestSignIn(
    'example-contract.testnet', // contract requesting access
  );
};

export const signOut = async () => {
  const wallet = await getWalletInstance();
  wallet.signOut();
};

export const getBalanceOf = async ({ refundable }) => {
  if (refundable) {
    return Promise.resolve(0);
  }
  const near = await getNearInstance();
  const accountInfo = await near.account('duyphan.testnet');
  return accountInfo.getAccountBalance();
};

export const getNearAccountInfo = async () => {
  const near = await getNearInstance();
  const wallet = await getWalletInstance(near);
  if (wallet && wallet.isSignedIn()) {
    const accountInfo = await near.account('duyphan.testnet');
    const balance = await accountInfo.getAccountBalance();

    account.setAccountInfo({
      address: accountInfo.accountId,
      balance: ethers.utils.formatEther(balance.total),
      wallet: wallets.near,
      unit: nativeTokens[connectedNetWorks.near].symbol,
      currentNetwork: connectedNetWorks.near,
    });
  }
};
