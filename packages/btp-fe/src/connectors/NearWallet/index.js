import * as nearAPI from 'near-api-js';
import { NEAR_NODE } from 'connectors/constants';
import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';
import { SuccessSubmittedTxContent } from 'components/NotificationModal/SuccessSubmittedTxContent';
import { chainConfigs, formatSymbol } from 'connectors/chainConfigs';

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
        modal.openModal({
          icon: 'approveIcon',
          desc: `You've deposited to transfer your token! Please click the Transfer button to continue.`,
          button: {
            id: 'approve-transfer-btn',
            text: 'Transfer',
            onClick: transfer,
          },
        });
      }
      break;
    default:
      break;
  }

  // window.history.replaceState(null, '', pathname);
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
    viewMethods: ['balance_of', 'ft_balance_of'],
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
  const { refundable } = options || {};

  try {
    if (refundable) {
      return 0; // TODO: implementation
    }
    return 1;
  } catch (err) {
    console.log(err);
    return 1;
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

export const deposit = async (amount, to, isNativeCoin) => {
  const amountInYocto = nearAPI.utils.format.parseNearAmount(amount);

  if (isNativeCoin) {
    (await getContractInstance()).deposit({
      callbackUrl:
        location.href + '?' + new URLSearchParams({ amount, to, isNativeCoin }).toString(),
      args: {},
      gas: NEAR_NODE.GAS_LIMIT,
      amount: amountInYocto,
    });
  } else {
    (await getContractInstance(NEAR_NODE.ICXNEP141Address)).ft_transfer_call({
      callbackUrl: location.href + '?' + new URLSearchParams({ amount, to }).toString(),
      args: { receiver_id: chainConfigs.NEAR.BTS_CORE, amount: amountInYocto, msg: '' },
      gas: NEAR_NODE.GAS_LIMIT,
      amount: amountInYocto,
    });
  }
};

export const transfer = async ({ value, to }) => {
  try {
    const searchParams = new URLSearchParams(location.search.substring(1)) || {};

    if (!searchParams.get('transactionHashes')) {
      await deposit(value, to, true);
      return;
    }

    modal.openModal({
      icon: 'loader',
      desc: 'Please wait a moment.',
    });

    const transferResult = await functionCall('transfer', {
      coin_name: searchParams.get('isNativeCoin') ? 'btp-0x1.near-NEAR' : 'btp-0x2.icon-ICX',
      destination: 'btp://0x2.icon/' + searchParams.get('to'),
      amount: nearAPI.utils.format.parseNearAmount(searchParams.get('amount')),
    });

    if (transferResult?.transaction_outcome?.outcome?.status?.SuccessReceiptId) {
      modal.openModal({
        icon: 'checkIcon',
        children: (
          <SuccessSubmittedTxContent
            setDisplay={modal.setDisplay}
            txHash={searchParams.get('transactionHashes')}
          />
        ),
        button: {
          text: 'Continue transfer',
          onClick: () => modal.setDisplay(false),
        },
      });
    } else {
      throw new Error('transaction failed');
    }
  } catch (err) {
    console.log(err);
    modal.openModal({
      icon: 'xIcon',
      desc: 'Your transaction has failed. Please go back and try again.',
      button: {
        text: 'Back to transfer',
        onClick: () => modal.setDisplay(false),
      },
    });
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
    gas: NEAR_NODE.GAS_LIMIT,
  });
};

export const getTxStatus = async (txHash) => {
  const wallet = await getWalletInstance();
  const provider = new nearAPI.providers.JsonRpcProvider(NEAR_NODE.nodeUrl);

  const result = await provider.txStatus(txHash, wallet.getAccountId());
  console.log('Result: ', result);

  return result;
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

export const withdraw = async (token, amount) => {
  const amountInYocto = nearAPI.utils.format.parseNearAmount(amount);

  (await getContractInstance()).withdraw({
    args: {
      coin_name: formatSymbol(token),
      amount: amountInYocto,
    },
    gas: NEAR_NODE.GAS_LIMIT,
    amount: '1', // Requires attached deposit of exactly 1 yoctoNEAR
  });
};
