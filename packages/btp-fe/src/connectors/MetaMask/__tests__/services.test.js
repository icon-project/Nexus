import { getBalanceOf } from '../services';

jest.mock('connectors/MetaMask', () => ({
  EthereumInstance: {
    BEP20Contract: { balanceOf: jest.fn().mockReturnValue({ _hex: '0x19e46e036aab4e8b01' }) },
    contract: {
      getBalanceOf: jest
        .fn()
        .mockReturnValue({ _refundableBalance: { _hex: '0x29e46e036aab4e8b00' } }),
    },
  },
}));
describe('MetaMask/services', () => {
  test('getBalanceOf ERC20 token (ETH)', async () => {
    const balance = await getBalanceOf({ isToken: true });

    expect(balance).toEqual(477.628699);
  });
  test('getBalanceOf coin (refundable balance)', async () => {
    const refundableBalance = await getBalanceOf({ refundable: true });

    expect(refundableBalance).toEqual('772.776604466852825856');
  });
});
