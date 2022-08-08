describe('interact with Hana', () => {
  it('transfer ICX', () => {
    cy.transferWithHana({ tokenName: 'ICX' });
  });

  it('transfer sICX', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'sICX' });
  });

  it('transfer bnUSD', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'bnUSD' });
  });

  it('transfer BUSD', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'BUSD' });
  });

  it('transfer USDT', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'USDT' });
  });

  it('transfer USDC', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'USDC' });
  });

  it('transfer BTCB', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'BTCB' });
  });

  it('transfer ETH', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'ETH' });
  });

  it('transfer BNB', () => {
    cy.transferWithHana({ twoStep: true, tokenName: 'BNB', amount: 0.01 });
  });
});
