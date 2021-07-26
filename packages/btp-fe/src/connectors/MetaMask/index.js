import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';
import { METAMASK_LOCAL_ADDRESS, allowedNetworkIDs } from '../constants';

import { SuccessSubmittedTxContent } from 'components/NotificationModal/SuccessSubmittedTxContent';

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
  async tranferToken(to, value) {
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: to, // Required except during contract publications.
      from: this.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(value)._hex, // Only required to send ether to the recipient from the initiating external account.
      chainId: this.ethereum.selectedAddress.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    try {
      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      if (txHash) {
        modal.openModal({
          icon: 'checkIcon',
          children: <SuccessSubmittedTxContent />,
          button: {
            text: 'Continue transfer',
            onClick: () => modal.setDisplay(false),
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
}

const EthereumInstance = new Ethereum();
EthereumInstance.chainChangedListener();

export { EthereumInstance };
