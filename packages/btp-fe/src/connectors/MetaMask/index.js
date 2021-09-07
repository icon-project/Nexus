import { ethers } from 'ethers';
import store from 'store';
import {
  ADDRESS_LOCAL_STORAGE,
  CONNECTED_WALLET_LOCAL_STORAGE,
  MOON_BEAM_NODE,
  allowedNetworkIDs,
  currentICONexNetwork,
} from '../constants';
import { MB_ABI } from './moonBeamABI';
import { convertToICX, resetTransferStep } from 'connectors/ICONex/utils';
import { toChecksumAddress } from './utils';
import { wallets } from 'utils/constants';
import { roundNumber } from 'utils/app';

import { SuccessSubmittedTxContent } from 'components/NotificationModal/SuccessSubmittedTxContent';

const { modal, account } = store.dispatch;

const metamaskURL =
  'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
class Ethereum {
  constructor() {
    this.ethereum = window.ethereum;
    this.provider = this.ethereum && new ethers.providers.Web3Provider(this.ethereum);
    this.BSH_ABI = new ethers.utils.Interface(MB_ABI);
    this.contract = new ethers.Contract(MOON_BEAM_NODE.BSHCore, MB_ABI, this.provider);
  }

  get getEthereum() {
    if (!this.isMetaMaskInstalled()) {
      window.open(metamaskURL);
      throw new Error('MetaMask has not been installed');
    }
    return this.ethereum;
  }

  set setEthereum(value) {
    this.ethereum = value;
  }

  get getProvider() {
    if (!this.isMetaMaskInstalled()) {
      window.open(metamaskURL);
      throw new Error('MetaMask has not been installed');
    }
    return this.provider;
  }

  set setProvider(value) {
    this.provider = value;
  }

  isMetaMaskInstalled() {
    return Boolean(this.ethereum && this.ethereum.isMetaMask);
  }

  isMetaMaskConnected() {
    return this.ethereum && this.ethereum.isConnected();
  }

  isAllowedNetwork() {
    if (
      this.ethereum.chainId &&
      !Object.keys(allowedNetworkIDs.metamask).includes(this.ethereum.chainId)
    ) {
      modal.openModal({
        desc:
          'The connected wallet is conflicted with your Source or Destination blockchain. Please change your blockchain option or reconnect a new wallet.',
        button: {
          text: 'Okay',
          onClick: () => modal.setDisplay(false),
        },
      });

      account.resetAccountInfo();
      return false;
    }
    return true;
  }

  async connectMetaMaskWallet() {
    if (!this.isMetaMaskInstalled()) {
      localStorage.removeItem(CONNECTED_WALLET_LOCAL_STORAGE);
      window.open(metamaskURL);
      return;
    }
    try {
      const isAllowedNetwork = this.isAllowedNetwork();

      if (isAllowedNetwork) {
        await this.getEthereum.request({ method: 'eth_requestAccounts' });
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  chainChangedListener() {
    if (this.isMetaMaskConnected()) {
      this.getEthereum.on('chainChanged', (chainId) => {
        console.log('Change Network', chainId);
        window.location.reload();
      });
    }
  }

  async getBalanceOf({ address, refundable = false, symbol = 'ICX' }) {
    try {
      const balance = await this.contract.getBalanceOf(address, symbol);
      return refundable
        ? convertToICX(balance._refundableBalance._hex)
        : roundNumber(convertToICX(balance[0]._hex), 6);
    } catch (err) {
      console.log('Err: ', err);
      return 0;
    }
  }

  async getEthereumAccounts() {
    try {
      const isAllowedNetwork = this.isAllowedNetwork();

      if (isAllowedNetwork) {
        const wallet = wallets.metamask;
        const accounts = await this.getEthereum.request({ method: 'eth_accounts' });
        const address = toChecksumAddress(accounts[0]);
        localStorage.setItem(ADDRESS_LOCAL_STORAGE, address);
        const balance = await this.getProvider.getBalance(address);
        const currentNetwork = allowedNetworkIDs.metamask[this.getEthereum.chainId];
        account.setAccountInfo({
          address,
          balance: ethers.utils.formatEther(balance),
          wallet,
          unit: 'DEV',
          currentNetwork,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendTransaction(txParams) {
    try {
      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
      if (txHash) {
        modal.openModal({
          icon: 'checkIcon',
          children: <SuccessSubmittedTxContent />,
          button: {
            text: 'Continue transfer',
            onClick: () => {
              // back to transfer box
              resetTransferStep();
              modal.setDisplay(false);
            },
          },
        });
      }
      return txHash;
    } catch (error) {
      if (error.code === 4001) {
        modal.openModal({
          icon: 'exclamationPointIcon',
          desc: 'Transaction rejected.',
          button: {
            text: 'Dissmiss',
            onClick: () => modal.setDisplay(false),
          },
        });
        return;
      } else {
        modal.openModal({
          icon: 'xIcon',
          desc: error.message,
          button: {
            text: 'Back to transfer',
            onClick: () => modal.setDisplay(false),
          },
        });
        return;
      }
    }
  }

  async setApprovalForAll() {
    const data = this.BSH_ABI.encodeFunctionData('setApprovalForAll', [
      MOON_BEAM_NODE.BSHCore,
      '0x1',
    ]);

    await this.sendTransaction({
      from: this.ethereum.selectedAddress,
      to: MOON_BEAM_NODE.BSHCore,
      gas: MOON_BEAM_NODE.gasLimit,
      data,
    });
  }

  async reclaim({ coinName, value }) {
    const data = this.BSH_ABI.encodeFunctionData('reclaim', [coinName, value]);

    await this.sendTransaction({
      from: this.ethereum.selectedAddress,
      to: MOON_BEAM_NODE.BSHCore,
      gas: MOON_BEAM_NODE.gasLimit,
      data,
    });
  }

  async isApprovedForAll(address) {
    try {
      const result = await this.contract.isApprovedForAll(
        address || localStorage.getItem(ADDRESS_LOCAL_STORAGE),
        MOON_BEAM_NODE.BSHCore,
      );
      return result;
    } catch (err) {
      console.log('Err: ', err);
    }
  }

  async transfer(tx, sendNativeCoin) {
    // https://docs.metamask.io/guide/sending-transactions.html#example
    const value = ethers.utils.parseEther(tx.value)._hex;
    const { to } = tx;
    let txParams = {
      from: toChecksumAddress(this.ethereum.selectedAddress),
      value,
    };

    let data = null;
    if (sendNativeCoin) {
      data = this.BSH_ABI.encodeFunctionData('transferNativeCoin', [
        `btp://${currentICONexNetwork.networkAddress}/${to}`,
      ]);
    } else {
      data = this.BSH_ABI.encodeFunctionData('transfer', [
        'ICX',
        value,
        `btp://${currentICONexNetwork.networkAddress}/${to}`,
      ]);

      delete txParams.value;
    }

    txParams = {
      ...txParams,
      to: MOON_BEAM_NODE.BSHCore,
      gas: MOON_BEAM_NODE.gasLimit,
      data,
    };

    await this.sendTransaction(txParams);
  }
}

const EthereumInstance = new Ethereum();
EthereumInstance.chainChangedListener();

export { EthereumInstance };
