describe('interact with MetaMask', () => {
  before(() => {
    cy.setupMetamask(
      process.env.SECRET_WORDS,
      {
        networkName: 'BSC testnet',
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        chainId: '97',
        symbol: 'tBNB',
        blockExplorer: 'https://testnet.bscscan.com/',
        isTestnet: false,
      },
      process.env.PASSWORD,
    ).then((setupFinished) => {
      expect(setupFinished).to.be.true;
    });
  });

  it('first connect to MetaMask', () => {
    cy.connectMetaMaskWallet();
    cy.acceptMetamaskAccess().then((connected) => {
      expect(connected).to.be.true;
    });
  });

  it.skip('transfer BNB', () => {
    cy.transferMetaMask({ tokenName: 'BNB', amount: 0.01 });
  });

  it('transfer ICX', () => {
    cy.transferMetaMask({ tokenName: 'ICX', twoStep: true });
  });
});
