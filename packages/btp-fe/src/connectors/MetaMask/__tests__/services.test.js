import { getBalanceOf, transfer } from '../services';
import * as constans from 'connectors/constants';
import { EthereumInstance } from 'connectors/MetaMask';

const fromAddress = '0x07841E2b76dA0C527f5A446a7e3164Be5ec747c5';
const toAddress = 'hx6d338536ac11a0a2db06fb21fe8903e617a6764d';
const currentChain = {
  BSH_CORE: '0x0429281c3b39E3692f2f2c51682108a6ACA267c0',
  BSH_PROXY: '0xB39CC4bc36fF53499186B7331C4d07745661Ef9E',
  BEP20: '0x0583589D26a06810DEE3127cbE1E1d4344c4ACA6',
  GAS_LIMIT: '1312D00',
  methods: {},
};

jest.mock('connectors/MetaMask', () => ({
  EthereumInstance: {
    ethereum: {
      selectedAddress: fromAddress,
    },
    ABI: {
      encodeFunctionData: jest.fn(),
    },
    BEP20Contract: { balanceOf: jest.fn().mockReturnValue({ _hex: '0x19e46e036aab4e8b01' }) },
    contract: {
      getBalanceOf: jest
        .fn()
        .mockReturnValue({ _refundableBalance: { _hex: '0x29e46e036aab4e8b00' } }),
    },
    sendTransaction: jest.fn(),
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

  test.only('transfer native coin', async () => {
    const functionName = 'transferNativeCoin';
    const ABI = {
      encodeFunctionData: jest.fn(),
    };

    Object.defineProperty(EthereumInstance, 'ABI', {
      get: jest.fn(() => {
        return ABI;
      }),
    });

    jest.spyOn(constans, 'getCurrentChain').mockImplementation(() => currentChain);
    const encodeFunctionDataSpy = jest
      .spyOn(ABI, 'encodeFunctionData')
      .mockImplementation(() => functionName);

    const params = await transfer({ value: '10', to: toAddress }, true);

    expect(encodeFunctionDataSpy).toHaveBeenCalledWith(functionName, [
      expect.stringMatching(/(^btp:\/\/)*(\/hx6d338536ac11a0a2db06fb21fe8903e617a6764d)$/),
    ]);

    expect(params).toEqual({
      data: functionName,
      from: fromAddress,
      gas: expect.anything(),
      to: currentChain.BSH_CORE,
      value: '0x8ac7230489e80000',
    });
  });
});
