const { ethereum } = window;
export const isMetaMaskInstalled = () => {
  //Have to check the ethereum binding on the window object to see if it's installed
  return Boolean(ethereum && ethereum.isMetaMask);
};

export const isMetaMaskConnected = () => {
  return ethereum.isConnected();
};

export const disConnectMetaMask = () => {
  ethereum.on('disconnect', (error) => {
    console.log('error', error);
  });
};

export const getBalance = async (walletAddress) => {
  return await ethereum.request({
    method: 'eth_getBalance',
    params: [walletAddress, 'latest'],
  });
};
// const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

// //This will start the onboarding proccess
// const onClickInstall = () => {
//   //On this object we have startOnboarding which will start the onboarding process for our end user
//   onboarding.startOnboarding();
// };

export const connectMetaMaskWallet = async () => {
  try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
    await ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error(error);
  }
};

export const getEthereumAccounts = async () => {
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    return accounts;
  } catch (error) {
    console.error(error);
  }
};
