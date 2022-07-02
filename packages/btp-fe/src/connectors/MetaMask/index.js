import { ethers } from 'ethers';
import store from 'store';
import { ADDRESS_LOCAL_STORAGE, CONNECTED_WALLET_LOCAL_STORAGE } from 'connectors/constants';
import { ABI } from './ABI';

import { toChecksumAddress } from './utils';
import { findReplacementTx } from './findReplacementTx';
import { handleFailedTx, handleSuccessTx } from './handleNotification';
import { wallets } from 'utils/constants';
import { chainList, customzeChain, chainConfigs } from 'connectors/chainConfigs';

const { modal, account } = store.dispatch;

const metamaskURL =
  'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';

class Ethereum {
  constructor() {
    this.ethereum = window.ethereum;
    this.provider = this.ethereum && new ethers.providers.Web3Provider(this.ethereum);
    this.ABI = new ethers.utils.Interface(ABI);
    this.contract = null;
    this.BEP20Contract = null;
    this.PROXYContract = null;
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
      !chainList
        .map((chain) =>
          chain.id === chainConfigs.ICON.id ? '' : chain.NETWORK_ADDRESS?.split('.')[0],
        )
        .includes(this.ethereum.chainId)
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
    try {
      this.getEthereum.on('chainChanged', (chainId) => {
        console.log('Change Network', chainId);
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
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
        const currentNetwork = chainList.find((chain) =>
          chain.NETWORK_ADDRESS.startsWith(this.getEthereum.chainId),
        );

        if (!currentNetwork) throw new Error('not found chain config');

        const { CHAIN_NAME, id, COIN_SYMBOL, BSH_CORE, BEP20, BSH_PROXY } = currentNetwork;

        this.contract = new ethers.Contract(BSH_CORE, ABI, this.provider);
        if (BEP20 && BSH_PROXY) {
          this.BEP20Contract = new ethers.Contract(BEP20, ABI, this.provider);
          this.PROXYContract = new ethers.Contract(BSH_PROXY, ABI, this.provider);
        }

        customzeChain(id);
        account.setAccountInfo({
          address,
          balance: ethers.utils.formatEther(balance),
          wallet,
          symbol: COIN_SYMBOL,
          currentNetwork: CHAIN_NAME,
          id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async refreshBalance() {
    const address = localStorage.getItem(ADDRESS_LOCAL_STORAGE);
    const balance = await this.getProvider.getBalance(address);

    account.setAccountInfo({
      balance: ethers.utils.formatEther(balance),
    });
  }

  async sendTransaction(txParams) {
    try {
      modal.openModal({
        icon: 'loader',
        desc: 'Waiting for confirmation in your wallet.',
      });

      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
      let txInPoolIntervalTrigger = await this.provider.getTransaction(txHash);
      let txInPoolData = null;

      const safeReorgHeight = (await this.getProvider.getBlockNumber()) - 20;
      let mintedTx = null;
      let replacementTx = null;

      const checkTxRs = setInterval(async () => {
        if (txInPoolIntervalTrigger) {
          txInPoolIntervalTrigger = txInPoolData;
        }

        if (!txInPoolIntervalTrigger && !mintedTx && !replacementTx) {
          if (!txInPoolData) {
            console.error('No current transaction information.');
            clearInterval(checkTxRs);
            return;
          }
          replacementTx = await findReplacementTx(this.provider, safeReorgHeight, {
            nonce: txInPoolData.nonce,
            from: txInPoolData.from,
            to: txInPoolData.to,
            data: txInPoolData.data,
          });
        } else {
          txInPoolIntervalTrigger = await this.provider.getTransaction(txHash);
        }

        if (replacementTx) {
          clearInterval(checkTxRs);
          handleSuccessTx(replacementTx.hash);
        }
      }, 4000);

      // Emitted when the transaction has been mined
      this.provider.once(txHash, (transaction) => {
        mintedTx = transaction;
        clearInterval(checkTxRs);
        if (transaction.status === 1) {
          handleSuccessTx(txHash);
        } else {
          handleFailedTx();
        }
      });
    } catch (error) {
      if (error.code === 4001) {
        modal.openModal({
          icon: 'exclamationPointIcon',
          desc: 'Transaction rejected.',
          button: {
            text: 'Dismiss',
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
      }
    }
  }
}

const EthereumInstance = new Ethereum();
EthereumInstance.chainChangedListener();

export { EthereumInstance };
