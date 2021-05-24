import { ethers } from 'ethers';
import store from '../../store';
import { wallets } from '../../utils/constants';
import { METAMASK_LOCAL_ADDRESS } from '../constants';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const { ethereum } = window;

export const isMetaMaskInstalled = () => {
  //Have to check the ethereum binding on the window object to see if it's installed
  return Boolean(ethereum && ethereum.isMetaMask);
};

export const isMetaMaskConnected = () => {
  return ethereum.isConnected();
};

export const connectMetaMaskWallet = async () => {
  try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
    await ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error(error);
  }
};

const getCurrentNetwork = () => {
  switch (ethereum.chainId) {
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
};

export const getEthereumAccounts = async () => {
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const address = accounts[0];
    localStorage.setItem(METAMASK_LOCAL_ADDRESS, address);
    const balance = await provider.getBalance(address);
    const currentNetwork = getCurrentNetwork();
    store.dispatch.account.setAccountInfo({
      address,
      balance: ethers.utils.formatEther(balance),
      wallet: wallets.metamask,
      unit: 'ETH',
      currentNetwork,
    });
    return;
  } catch (error) {
    console.error(error);
  }
};
