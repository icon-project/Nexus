import * as nearAPI from 'near-api-js';
import { NEAR_NODE } from 'connectors/constants';
import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';
import {
  chainConfigs,
  formatSymbol,
  parseUnitsBySymbol,
  formatUnitsBySymbol,
} from 'connectors/chainConfigs';

const { account, modal } = store.dispatch;

export const handleNEARCallback = async (location) => {
  const { search, pathname } = location;

  switch (true) {
    // https://docs.near.org/docs/api/naj-quick-reference#sign-in
    // handle NEAR wallet connecting
    case search.startsWith('?near=true'):
      window.history.replaceState(null, '', pathname);
      break;
    // reject connecting wallet
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
    // handle error
    case search.startsWith('?errorCode='):
      window.history.replaceState(null, '', pathname);
      const msg = search.split('errorMessage=')?.[1];
      modal.openModal({
        icon: 'exclamationPointIcon',
        desc: msg,
        button: {
          text: 'Dismiss',
          onClick: () => modal.setDisplay(false),
        },
      });
      break;
    case search.includes('transactionHashes='):
      const searchParams = new URLSearchParams(search.substring(1));
      const result = await getTxStatus(searchParams.get('transactionHashes'));
      if (result?.transaction_outcome?.outcome?.status?.SuccessReceiptId) {
        if (searchParams.get('coinName')) {
          modal.informApprovedTransfer({ onClick: transfer, action: 'deposited' });
        } else {
          modal.informSubmittedTx({ txHash: searchParams.get('transactionHashes') });
          window.history.replaceState(null, '', location.pathname);
        }
      }
      break;
    default:
      break;
  }
};

const getNearInstance = async () => {
  return nearAPI.connect({
    ...NEAR_NODE,
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  });
};

const getWalletInstance = async (near) => {
  const nearInstance = near || (await getNearInstance());
  return new nearAPI.WalletConnection(nearInstance);
};

const getAccountInstance = async () => {
  const near = await getNearInstance();
  const wallet = await getWalletInstance(near);
  const account = await near.account(wallet.getAccountId());

  return account;
};

export const getContractInstance = async (contractId) => {
  const wallet = await getWalletInstance();
  const contract = new nearAPI.Contract(wallet.account(), contractId || NEAR_NODE.contractId, {
    viewMethods: ['balance_of', 'ft_balance_of', 'locked_balance_of'],
    changeMethods: ['deposit', 'ft_transfer_call', 'withdraw'],
    sender: wallet.getAccountId(),
  });

  return contract;
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
  const { refundable, lockedBalance, symbol } = options || {};

  try {
    if (refundable) {
      return 0; // TODO: implementation
    }
    if (lockedBalance) {
      const balance = await getUsableBalance(symbol);
      return formatUnitsBySymbol(balance, symbol);
    }

    const contract = await getContractInstance(NEAR_NODE.ICXNEP141Address);
    const wallet = await getWalletInstance();

    const result = await contract.ft_balance_of({
      account_id: wallet.getAccountId(),
      coin_name: formatSymbol(symbol),
    });

    return formatUnitsBySymbol(result, symbol);
  } catch (err) {
    console.log(err);
    return 0;
  }
};

export const getNearAccountInfo = async () => {
  const wallet = await getWalletInstance();
  if (wallet && wallet.isSignedIn()) {
    const accountInfo = await getAccountInstance();
    const id = 'NEAR';

    account.setAccountInfo({
      address: accountInfo.accountId,
      balance: ethers.utils.formatUnits((await accountInfo.getAccountBalance()).total, 24),
      wallet: wallets.near,
      symbol: id,
      currentNetwork: id,
      id,
    });
  }
};

export const deposit = async (amount, to, coinName, isNativeCoin) => {
  const amountInYocto = nearAPI.utils.format.parseNearAmount(amount);
  const payload = {
    callbackUrl: location.href + '?' + new URLSearchParams({ amount, to, coinName }).toString(),
    args: {},
    gas: chainConfigs.NEAR?.GAS_LIMIT,
    amount: amountInYocto,
  };

  if (isNativeCoin) {
    (await getContractInstance()).deposit(payload);
  } else {
    (await getContractInstance(NEAR_NODE.ICXNEP141Address)).ft_transfer_call({
      ...payload,
      args: {
        receiver_id: chainConfigs.NEAR.BTS_CORE,
        amount: parseUnitsBySymbol(amount, coinName, false),
        msg: '',
      },
      amount: '1', // Requires attached deposit of exactly 1 yoctoNEAR
    });
  }
};

export const transfer = async ({ value, to, coinName }, isSendingNativeCoin) => {
  try {
    const searchParams = new URLSearchParams(location.search.substring(1)) || {};

    if (!searchParams.get('transactionHashes')) {
      await deposit(value, to, coinName, isSendingNativeCoin);
      return;
    }

    modal.openModal({
      icon: 'loader',
      desc: 'Please wait a moment.',
    });

    const transferResult = await functionCall('transfer', {
      coin_name: formatSymbol(searchParams.get('coinName')),
      destination: 'btp://' + chainConfigs.ICON?.NETWORK_ADDRESS + '/' + searchParams.get('to'),
      amount: parseUnitsBySymbol(searchParams.get('amount'), searchParams.get('coinName'), false),
    });

    if (transferResult?.transaction_outcome?.outcome?.status?.SuccessReceiptId) {
      modal.informSubmittedTx({ txHash: searchParams.get('transactionHashes') });
    } else {
      throw new Error('transaction failed');
    }
  } catch (err) {
    console.log(err);
    modal.informFailedTx();
  } finally {
    window.history.replaceState(null, '', location.pathname);
  }
};

export const functionCall = async (methodName, args) => {
  const wallet = await getWalletInstance();
  return await wallet.account().functionCall({
    contractId: NEAR_NODE.contractId,
    methodName,
    args,
    gas: chainConfigs.NEAR?.GAS_LIMIT,
  });
};

export const getTxStatus = async (txHash) => {
  const wallet = await getWalletInstance();
  const provider = new nearAPI.providers.JsonRpcProvider(NEAR_NODE.nodeUrl);

  const result = await provider.txStatus(txHash, wallet.getAccountId());
  console.log('Result: ', result);

  return result;
};

export const getUsableBalance = async (symbol) => {
  const wallet = await getWalletInstance();
  const contract = await getContractInstance();

  const result = await contract.balance_of({
    account_id: wallet.getAccountId(),
    coin_name: formatSymbol(symbol),
  });

  return result;
};

export const withdraw = async (symbol, amount) => {
  (await getContractInstance()).withdraw({
    callbackUrl: location.origin + location.pathname,
    args: {
      coin_name: formatSymbol(symbol),
      amount: parseUnitsBySymbol(amount, symbol, false),
    },
    gas: chainConfigs.NEAR?.GAS_LIMIT,
    amount: '1', // Requires attached deposit of exactly 1 yoctoNEAR
  });
};

export const getLockedBalance = async (symbol) => {
  const wallet = await getWalletInstance();
  const contract = await getContractInstance();

  const result = await contract.locked_balance_of({
    owner_id: wallet.getAccountId(),
    coin_name: formatSymbol(symbol),
  });
  console.log('🚀 ~ file: index.js ~ line 309 ~ getLockedBalance ~ result', result);

  return result;
};
