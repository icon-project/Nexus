describe('connect MetaMask', () => {
  it('connect MetaMask', () => {
    cy.addMetamaskNetwork({
      networkName: 'harmony mainnet',
      rpcUrl: 'https://api.harmony.one',
      chainId: '1666600000',
      symbol: 'ONE',
      blockExplorer: 'https://explorer.harmony.one',
      isTestnet: false,
    });
    cy.changeMetamaskNetwork('harmony mainnet');

    cy.visit('/');
    cy.get('#confirm-beta-button').click();
    cy.get('.connect-to-wallet-btn').click();
    cy.get('#do-connecting-wallet').click();
    cy.acceptMetamaskAccess().then((connected) => {
      expect(connected).to.be.true;
    });
    cy.get('#duy').click();
  });
});
