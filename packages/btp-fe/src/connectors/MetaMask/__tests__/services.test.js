import { ethers } from 'ethers';
import { transfer, sendNoneNativeCoin } from '../services';
import * as constants from 'connectors/constants';
import * as chainConfigs from 'connectors/chainConfigs';
import { EthereumInstance } from 'connectors/MetaMask';

const fromAddress = '0x07841E2b76dA0C527f5A446a7e3164Be5ec747c5';
const toAddress = 'hx6d338536ac11a0a2db06fb21fe8903e617a6764d';
const amount = '10';
const currentChain = {
  BTS_CORE: '0x0429281c3b39E3692f2f2c51682108a6ACA267c0',
  BSH_PROXY: '0xB39CC4bc36fF53499186B7331C4d07745661Ef9E',
  BEP20: '0x0583589D26a06810DEE3127cbE1E1d4344c4ACA6',
  GAS_LIMIT: '1312D00',
  coinId: 'abc',
  methods: {},
};
const ABI = {
  encodeFunctionData: jest.fn(),
};

Object.defineProperty(EthereumInstance, 'ABI', {
  get: jest.fn(() => {
    return ABI;
  }),
});

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('connectors/MetaMask', () => ({
  EthereumInstance: {
    ethereum: {
      selectedAddress: fromAddress,
    },
    ABI: {
      encodeFunctionData: jest.fn(),
    },
    contract: {
      coinId: jest.fn().mockReturnValue(currentChain.coinId),
    },
    sendTransaction: jest.fn(),
  },
}));

describe('MetaMask/services', () => {
  test('getBalanceOf IRC2', async () => {
    // TODO
    expect(true).toEqual(true);
  });

  test('getBalanceOf refundable balance', async () => {
    // TODO
    expect(true).toEqual(true);
  });

  test('transfer native coin', async () => {
    const functionName = 'transferNativeCoin';

    jest.spyOn(constants, 'getCurrentChain').mockImplementation(() => currentChain);
    const encodeFunctionDataSpy = jest
      .spyOn(ABI, 'encodeFunctionData')
      .mockImplementation(() => functionName);

    const params = await transfer({ value: amount, to: toAddress }, true);

    expect(window[constants.signingActions.globalName]).toEqual(constants.signingActions.transfer);
    expect(encodeFunctionDataSpy).toHaveBeenCalledWith(functionName, [
      expect.stringMatching(/(^btp:\/\/)*(\/hx6d338536ac11a0a2db06fb21fe8903e617a6764d)$/),
    ]);

    expect(params).toEqual({
      data: functionName,
      from: fromAddress,
      gas: expect.anything(),
      to: currentChain.BTS_CORE,
      value: '0x8ac7230489e80000',
    });
  });

  test('approve non-native coin', async () => {
    const functionName = 'approve';

    jest.spyOn(constants, 'getCurrentChain').mockImplementation(() => currentChain);
    jest.spyOn(chainConfigs, 'checkIsToken').mockImplementation(() => true);
    const encodeFunctionDataSpy = jest
      .spyOn(ABI, 'encodeFunctionData')
      .mockImplementation(() => functionName);

    const params = await transfer({ value: amount, to: toAddress }, false);

    expect(window[constants.signingActions.globalName]).toEqual(constants.signingActions.approve);
    expect(encodeFunctionDataSpy).toHaveBeenCalledWith(functionName, [
      currentChain.BTS_CORE,
      ethers.utils.parseEther(amount)._hex,
    ]);

    expect(params).toEqual({
      data: functionName,
      from: fromAddress,
      gas: expect.anything(),
      to: currentChain.coinId,
    });
  });

  test('transfer non-native coin', async () => {
    const functionName = 'transfer';
    const coinName = 'ICX';

    window[constants.rawTransaction] = { value: amount, to: toAddress, coinName };
    jest.spyOn(constants, 'getCurrentChain').mockImplementation(() => currentChain);
    jest.spyOn(chainConfigs, 'checkIsToken').mockImplementation(() => false);
    const encodeFunctionDataSpy = jest
      .spyOn(ABI, 'encodeFunctionData')
      .mockImplementation(() => functionName);

    const params = await sendNoneNativeCoin();

    expect(window[constants.signingActions.globalName]).toEqual(constants.signingActions.transfer);
    expect(encodeFunctionDataSpy).toHaveBeenCalledWith(functionName, [
      coinName,
      ethers.utils.parseEther(amount)._hex,
      expect.stringMatching(/(^btp:\/\/)*(\/hx6d338536ac11a0a2db06fb21fe8903e617a6764d)$/),
    ]);

    expect(params).toEqual({
      data: functionName,
      from: fromAddress,
      gas: expect.anything(),
      to: currentChain.BTS_CORE,
    });
  });
});
