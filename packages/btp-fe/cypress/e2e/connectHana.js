import { E2ETestingRoute } from '../../src/utils/constants';

describe('interact with Hana', () => {
  it('connect Hana', () => {
    cy.visit(E2ETestingRoute);
    cy.get('header a[href="/transfer"]').click();

    cy.get('.connect-to-wallet-btn').click();
    cy.get('.iconex-wallet-selector', { timeout: 10000 }).should('be.visible').click();
    cy.get('#do-connecting-wallet').click();
    cy.get('#hana-simulation-authorize-button').click();
  });
});
