import { ethers } from 'ethers';
import store from 'store';
import { wallets } from 'utils/constants';
import { METAMASK_LOCAL_ADDRESS, MOON_BEAM_NODE, allowedNetworkIDs } from '../constants';
import { MB_ABI } from './moonBeamABI';
import { convertToICX } from 'connectors/ICONex/utils';

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

  async getBalanceOf(address, symbol = 'ICX') {
    try {
      const contract = new ethers.Contract(MOON_BEAM_NODE.BSHCore, MB_ABI, this.provider);

      const balance = await contract.getBalanceOf(address, symbol);
      return convertToICX(balance[0]._hex);
    } catch (err) {
      console.log('Err: ', err);
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
        const ICXBalanceOf = await this.getBalanceOf(address);
        console.log('ICXBalanceOf', ICXBalanceOf);

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

  async getRS() {
    const rs = await this.provider.getTransactionReceipt(
      '0x3218832f7da553907e86092dfd52b1abfbf172ed1295f98a5ac0a7e1b803a628',
    );
    console.log('🚀 ~ file: index.js ~ line 138 ~ Ethereum ~ getRS ~ rs', rs);
  }

  async transferNativeCoin() {
    try {
      const BSH_ABI = new ethers.utils.Interface(MB_ABI);

      const data = BSH_ABI.encodeFunctionData('transferNativeCoin', [
        'btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
      ]);

      const value = ethers.utils.parseEther('1')._hex;
      const tx = {
        from: '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
        to: MOON_BEAM_NODE.BSHCore,
        gas: '6691B7',
        data,
        value,
      };

      const txHash = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });
      console.log(
        '🚀 ~ file: index.js ~ line 157 ~ Ethereum ~ transferNativeCoin ~ txHash',
        txHash,
      );
    } catch (err) {
      console.log('Err: ', err);
    }
  }

  async tranferToken(to, value) {
    // https://docs.metamask.io/guide/sending-transactions.html#example
    const transactionParameters = {
      nonce: '0x00',
      to: to || '0x5Aa12918084d969caddA6b31c509E44127FBa0A1',
      from: '0x4b0d307675cdae97fc624e1987b942f4b9483231',
      value: ethers.utils.parseEther(value || '0.1')._hex,
      chainId: '1281',
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
