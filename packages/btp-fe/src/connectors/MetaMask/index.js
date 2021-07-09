import { ethers } from 'ethers';
import store from '../../store';
import { wallets } from '../../utils/constants';
import { METAMASK_LOCAL_ADDRESS, allowedNetworkIDs } from '../constants';

const { modal, account } = store.dispatch;

const metamaskURL =
  'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
class Ethereum {
  constructor() {
    this.ethereum = window.ethereum;
    this.provider = this.ethereum && new ethers.providers.Web3Provider(this.ethereum);
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
    if (!Object.keys(allowedNetworkIDs.metamask).includes(this.ethereum.chainId)) {
      modal.openModal({
        desc:
          'The connected wallet is conflicted with your Source or Destination blockchain. Please change your blockchain option or reconnect a new wallet.',
        button: {
          text: 'Okay',
          onClick: () => modal.setDisplay(false),
        },
      });

      return false;
    }
    return true;
  }

  async connectMetaMaskWallet() {
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

  async getEthereumAccounts() {
    try {
      const isAllowedNetwork = this.isAllowedNetwork();

      if (isAllowedNetwork) {
        const accounts = await this.getEthereum.request({ method: 'eth_accounts' });
        const address = accounts[0];
        localStorage.setItem(METAMASK_LOCAL_ADDRESS, address);
        const balance = await this.getProvider.getBalance(address);
        const currentNetwork = allowedNetworkIDs.metamask[this.getEthereum.chainId];

        account.setAccountInfo({
          address,
          balance: ethers.utils.formatEther(balance),
          wallet: wallets.metamask,
          unit: 'ETH',
          currentNetwork,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const EthereumInstance = new Ethereum();
EthereumInstance.chainChangedListener();

export { EthereumInstance };
