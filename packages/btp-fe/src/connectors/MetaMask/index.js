import { ethers, utils } from 'ethers';
import store from 'store';
import { ADDRESS_LOCAL_STORAGE } from 'connectors/constants';
import { ABI } from './ABI';

import { ConflictNetworkWarning } from 'components/NotificationModal/ConflictNetworkWarning';
import { toChecksumAddress } from './utils';
import { findReplacementTx } from './findReplacementTx';
import { handleFailedTx, handleSuccessTx, handleError } from './handleNotification';
import { wallets } from 'utils/constants';
import { chainList, chainConfigs } from 'connectors/chainConfigs';

const { modal, account } = store.dispatch;

class Ethereum {
  constructor() {
    this.ethereum = window.ethereum;
    this.provider = this.ethereum && new ethers.providers.Web3Provider(this.ethereum, 'any');
    this.ABI = new ethers.utils.Interface(ABI);
    this.contract = null;
  }

  get getEthereum() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask has not been installed');
    }
    return this.ethereum;
  }

  set setEthereum(value) {
    this.ethereum = value;
  }

  get getProvider() {
    if (!this.isMetaMaskInstalled()) {
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

  async switchChainInMetamask() {
    const { NETWORK_ADDRESS, EXPLORE_URL, RPC_URL, COIN_SYMBOL, CHAIN_NAME } =
      chainConfigs['BSC'] || {}; // HARD CODE BSC HERE
    const chainId = NETWORK_ADDRESS?.split('.')[0];
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      return chainId;
    } catch (error) {
      // Error Code 4902 means the network we're trying to switch is not available so we have to add it first
      if (error.code == 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName: CHAIN_NAME + ' ' + process.env.REACT_APP_ENV,
                rpcUrls: [RPC_URL],
                // iconUrls: [logoUrl],
                blockExplorerUrls: [EXPLORE_URL],
                nativeCurrency: {
                  name: COIN_SYMBOL,
                  symbol: COIN_SYMBOL,
                  decimals: 18,
                },
              },
            ],
          });
          return chainId;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  isAllowedNetwork(chainId) {
    if (
      this.ethereum.chainId &&
      !chainList
        .map((chain) =>
          chain.id === chainConfigs.ICON.id ? '' : chain.NETWORK_ADDRESS?.split('.')[0],
        )
        .includes(chainId || this.ethereum.chainId)
    ) {
      return false;
    }
    return true;
  }

  async connectMetaMaskWallet() {
    try {
      const chainId = await this.switchChainInMetamask();
      if (chainId) {
        await this.getEthereum.request({ method: 'eth_requestAccounts' });
      } else {
        const isAllowed = this.isAllowedNetwork(chainId);
        if (!isAllowed) {
          const metaMaskSourceList = chainList.filter((item) => item.id !== chainConfigs.ICON?.id);
          modal.openModal({
            children: <ConflictNetworkWarning sourceList={metaMaskSourceList} />,
            button: {
              text: 'Okay',
              onClick: () => modal.setDisplay(false),
            },
          });
        }
        account.resetAccountInfo();
        return false;
      }
      return chainId;
    } catch (error) {
      console.log(error);
    }
  }

  chainChangedListener() {
    try {
      this.ethereum?.on('chainChanged', (chainId) => {
        console.log('Change Network', chainId);
        account.resetAccountInfo();
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getEthereumAccounts(chainId) {
    try {
      const accounts = await this.getEthereum.request({ method: 'eth_accounts' });
      const isAllowed = this.isAllowedNetwork();

      if (isAllowed) {
        const currentNetwork = chainList.find((chain) =>
          chain.NETWORK_ADDRESS.startsWith(chainId || this.getEthereum.chainId),
        );

        if (!currentNetwork) throw new Error('not found chain config');

        const address = toChecksumAddress(accounts[0]);
        localStorage.setItem(ADDRESS_LOCAL_STORAGE, address);
        const balance = await this.getProvider.getBalance(address);

        const { CHAIN_NAME, id, COIN_SYMBOL, BTS_CORE } = currentNetwork;
        this.contract = new ethers.Contract(BTS_CORE, ABI, this.provider);

        account.setAccountInfo({
          address,
          balance: ethers.utils.formatEther(balance),
          wallet: wallets.metamask,
          symbol: COIN_SYMBOL,
          currentNetwork: CHAIN_NAME,
          id,
        });
      }
    } catch (error) {
      console.log(error);
      account.resetAccountInfo();
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

      const gasPrice = utils.hexValue(Math.round((await this.provider.getGasPrice()) * 1.04));

      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ ...txParams, gasPrice }],
      });
      let txInPoolIntervalTrigger = await this.provider.getTransaction(txHash);
      let txInPoolData = null;

      const safeReorgHeight = (await this.getProvider.getBlockNumber()) - 20;
      let minedTx = null;
      let replacementTx = null;

      // For checking replacement tx by speeding up or cancelling tx from MetaMask
      const checkTxRs = setInterval(async () => {
        if (txInPoolIntervalTrigger) {
          txInPoolData = txInPoolIntervalTrigger;
        }

        if (!txInPoolIntervalTrigger && !minedTx && !replacementTx) {
          if (!txInPoolData) {
            console.error('No current transaction information.');
            clearInterval(checkTxRs);
            return;
          }
          try {
            replacementTx = await findReplacementTx(this.provider, safeReorgHeight, {
              nonce: txInPoolData.nonce,
              from: txInPoolData.from,
              to: txInPoolData.to,
              data: txInPoolData.data,
            });
          } catch (error) {
            clearInterval(checkTxRs);
            handleFailedTx(error?.message);
          }
        } else {
          txInPoolIntervalTrigger = await this.provider.getTransaction(txHash);
        }

        if (replacementTx) {
          clearInterval(checkTxRs);
          handleSuccessTx(replacementTx.hash);
        }
      }, 3000);

      // Emitted when the transaction has been mined
      this.provider.once(txHash, (transaction) => {
        clearInterval(checkTxRs);
        minedTx = transaction;
        if (transaction.status === 1) {
          handleSuccessTx(txHash);
        } else {
          handleFailedTx();
        }
      });
    } catch (error) {
      handleError(error);
    }
  }
}

const EthereumInstance = new Ethereum();
EthereumInstance.chainChangedListener();

export { EthereumInstance };
