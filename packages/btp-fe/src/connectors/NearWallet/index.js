import * as nearAPI from 'near-api-js';
import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';
import { chainConfigs } from 'connectors/chainConfigs';

const { account } = store.dispatch;

const getNearInstance = async () =>
  nearAPI.connect({
    networkId: chainConfigs.NEAR.NETWORK_ID,
    contractId: chainConfigs.NEAR.CONTRACT_ID,
    nodeUrl: chainConfigs.NEAR.NODE_URL,
    walletUrl: chainConfigs.NEAR.WALLET_URL,
    helperUrl: chainConfigs.NEAR.HELPER_URL,
    explorerUrl: chainConfigs.NEAR.EXPLORER_URL,
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
      chainConfigs.NEAR.CONTRACT_ID, // contract requesting access
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
      unit: chainConfigs.NEAR.COIN_SYMBOL,
      currentNetwork: chainConfigs.NEAR.CHAIN_NAME,
      id: chainConfigs.NEAR.id,
    });
  }
};

export const transfer = async ({ value, to }) => {
  const wallet = await getWalletInstance();

  // https://github.com/near-examples/guest-book
  // https://explorer.testnet.near.org/accounts/guest-book.testnet

  const contract = await new nearAPI.Contract(
    // User's accountId as a string
    wallet.account(),
    // accountId of the contract we will be loading
    // NOTE: All contracts on NEAR are deployed to an account and
    // accounts can only have one contract deployed to them.
    chainConfigs.NEAR.CONTRACT_ID,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: ['getMessages'],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ['addMessage'],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: wallet.getAccountId(),
    },
  );

  await contract.addMessage(
    { text: to },
    '30000000000000',
    nearAPI.utils.format.parseNearAmount(value),
  );
};
