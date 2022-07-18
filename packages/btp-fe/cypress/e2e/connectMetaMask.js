describe('connect MetaMask', () => {
  test.skip('connect MetaMask', () => {
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
    cy.get('#assest-selector').click();
    cy.get('#ONE-select-item').click();
    cy.get('#transfer-next-button').click();

    cy.get('input[name=tokenAmount]').type('0.1');
    cy.get('input[name=recipient]').type('hxeffc184905bfff5db8879914690ba6e5cab2f224');
    cy.get('#Transfer-button').click();
    cy.get('#Approve-button').click();

    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });

    cy.get('#duy').click();
  });
});
