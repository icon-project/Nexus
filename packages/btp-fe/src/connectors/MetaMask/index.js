import { ethers } from 'ethers';
import store from '../../store';
import { wallets } from '../../utils/constants';
import { METAMASK_LOCAL_ADDRESS } from '../constants';

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
      throw new Error('no ethereum object');
    }
    return this.ethereum;
  }

  set setEthereum(value) {
    this.ethereum = value;
  }

  get getProvider() {
    if (!this.isMetaMaskInstalled()) {
      window.open(metamaskURL);
      throw new Error('no provider object');
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

  async connectMetaMaskWallet() {
    try {
      await this.getEthereum.request({ method: 'eth_requestAccounts' });
      return true;
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

  getCurrentNetwork() {
    switch (this.getEthereum.chainId) {
      case '0x1':
        return 'Mainnet';
      case '0x3':
        return 'Ropsten';
      case '0x4':
        return 'Rinkeby';
      case '0x5':
        return 'Goerli';
      case '0x2a':
        return 'Kovan';
      default:
        return '';
    }
  }

  async getEthereumAccounts() {
    try {
      const accounts = await this.getEthereum.request({ method: 'eth_accounts' });
      const address = accounts[0];
      localStorage.setItem(METAMASK_LOCAL_ADDRESS, address);
      const balance = await this.getProvider.getBalance(address);
      const currentNetwork = this.getCurrentNetwork();

      store.dispatch.account.setAccountInfo({
        address,
        balance: ethers.utils.formatEther(balance),
        wallet: wallets.metamask,
        unit: 'ETH',
        currentNetwork,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const EthereumInstance = new Ethereum();
EthereumInstance.chainChangedListener();

export { EthereumInstance };
