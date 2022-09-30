// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { E2ETestingRoute } from '../../src/utils/constants';

Cypress.Commands.add('selectToken', (tokenName) => {
  cy.get('#assest-selector').click();
  cy.get(`#${tokenName}-select-item`).click();
  cy.get('#transfer-next-button').click();
});

Cypress.Commands.add('connectHanaWallet', () => {
  cy.visit(E2ETestingRoute);
  cy.get('header a[href="/transfer"]').click();

  cy.get('.connect-to-wallet-btn').click();
  cy.get('.iconex-wallet-selector', { timeout: 10000 }).should('be.visible').click();
  cy.get('#do-connecting-wallet').click();
  cy.get('#hana-simulation-authorize-button').click();
});

Cypress.Commands.add('connectMetaMaskWallet', () => {
  cy.visit(E2ETestingRoute);
  cy.get('header a[href="/transfer"]').click();

  cy.get('.connect-to-wallet-btn').click();
  cy.get('#do-connecting-wallet').click();
});

Cypress.Commands.add('inputTransfer', (amount, recipient) => {
  cy.wait(2000); // wait for fetch balance
  cy.get('input[name=tokenAmount]').type(amount);
  cy.get('input[name=recipient]').type(recipient);
  cy.get('#Transfer-button').click();
  cy.get('#Approve-button').click();
});

Cypress.Commands.add('transferWithHana', (params = {}) => {
  const {
    amount = 2,
    recipient = '0x07841E2b76dA0C527f5A446a7e3164Be5ec747c5',
    twoStep,
    tokenName,
  } = params;

  cy.connectHanaWallet();
  cy.selectToken(tokenName);
  cy.inputTransfer(amount, recipient);
  cy.get('#hana-simulation-sign-button').click();

  if (twoStep) {
    cy.get('#approve-transfer-btn', { timeout: 20000 }).click();
    cy.get('#hana-simulation-sign-button').click();
  }

  cy.get('#success-tx-modal', { timeout: 200000 }).should('be.visible');
  cy.get('.close-btn').click();
});

Cypress.Commands.add('transferMetaMask', (params = {}) => {
  const {
    amount = 1,
    recipient = 'hx6d338536ac11a0a2db06fb21fe8903e617a6764d',
    twoStep,
    tokenName,
  } = params;

  cy.connectMetaMaskWallet();
  cy.selectToken(tokenName);
  cy.inputTransfer(amount, recipient);
  if (twoStep) {
    cy.confirmMetamaskPermissionToSpend().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
  } else {
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
  }

  if (twoStep) {
    cy.get('#approve-transfer-btn', { timeout: 200000 }).click();
    cy.confirmMetamaskTransaction().then((confirmed) => {
      expect(confirmed).to.be.true;
    });
  }

  cy.get('#success-tx-modal', { timeout: 200000 }).should('be.visible');
  cy.get('.close-btn').click();
});
