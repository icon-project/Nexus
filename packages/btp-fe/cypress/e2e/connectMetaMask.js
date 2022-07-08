describe('connect MetaMask', () => {
  it('connect MetaMask', () => {
    cy.visit('/');
    cy.get('#abc').click();
    cy.get('.connect-to-wallet-btn').click();
    cy.get('#do-connecting-wallet').click();
  });
});
