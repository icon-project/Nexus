describe('empty spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.switchMetamaskAccount(1).should('be.true');
  });
});
