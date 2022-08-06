describe('interact with Hana', () => {
  it('transfer ICX', () => {
    cy.transfer({ tokenName: 'ICX' });
  });

  it('transfer sICX', () => {
    cy.transfer({ twoStep: true, tokenName: 'sICX' });
  });

  it('transfer bnUSD', () => {
    cy.transfer({ twoStep: true, tokenName: 'bnUSD' });
  });

  it('transfer BUSD', () => {
    cy.transfer({ twoStep: true, tokenName: 'BUSD' });
  });

  it('transfer USDT', () => {
    cy.transfer({ twoStep: true, tokenName: 'USDT' });
  });

  it('transfer USDC', () => {
    cy.transfer({ twoStep: true, tokenName: 'USDC' });
  });

  it('transfer BTCB', () => {
    cy.transfer({ twoStep: true, tokenName: 'BTCB' });
  });

  it('transfer ETH', () => {
    cy.transfer({ twoStep: true, tokenName: 'ETH' });
  });
});
