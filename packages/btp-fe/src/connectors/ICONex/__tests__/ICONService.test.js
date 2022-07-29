import { IconUtil, IconConverter, IconBuilder } from 'icon-sdk-js';
const { CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { signingActions, txPayload } from 'connectors/constants';
import * as chainConfigs from 'connectors/chainConfigs';

import * as ICONService from '../ICONServices';
import * as constants from 'connectors/constants';
import { transfer } from '../transfer';
import * as utils from '../utils';

const amount = 10;
const toAddress = '0x07841E2b76dA0C527f5A446a7e3164Be5ec747c5';
const harmonyChain = {
  network: 'HARMONY',
  COIN_SYMBOL: 'ONE',
  ICON_BTS_CORE: 'cxe24a2f5f46227ba91962d172945875c805f63e63',
  NETWORK_ADDRESS: '0x6357d2e0.hmny',
  ICON_IRC2_ADDRESS: 'abc',
  ICON_TOKEN_BSH_ADDRESS: 'xyz',
};

jest.mock('store', () => {
  return {
    dispatch: {
      modal: {
        isICONexWalletConnected: jest.fn().mockImplementation(() => true),
        openModal: jest.fn(),
      },
    },
    getState: jest.fn().mockImplementation(() => ({ account: {} })),
  };
});

jest.mock('connectors/chainConfigs', () => ({
  chainConfigs: {
    HARMONY: harmonyChain,
  },
  checkIsToken: jest.fn(),
  chainList: [harmonyChain],
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ICONService', () => {
  test('signTx', () => {
    const transactions = { from: 'alice', to: 'bob', value: 1 };
    const options = {
      builder: new CallTransactionBuilder(),
      method: 'transfer',
      params: { _coinName: 'DEV' },
      nid: '0x58eb1c',
      timestamp: '123',
      stepLimit: 2500000,
    };

    const txBuilder = new CallTransactionBuilder();
    const tx = txBuilder
      .from(transactions.from)
      .to(transactions.to)
      .stepLimit(IconConverter.toBigNumber(options.stepLimit))
      .nid(IconConverter.toBigNumber(options.nid))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp(options.timestamp)
      .value(utils.convertToLoopUnit(transactions.value))
      .method(options.method)
      .params(options.params)
      .build();

    const rawTx = IconConverter.toRawTransaction(tx);
    const hash = serialize(rawTx);
    const result = ICONService.signTx(transactions, options);

    expect(result).toBe(hash);
  });

  describe('transfer', () => {
    test('send native coin', async () => {
      const mock_sendNativeCoin = jest.spyOn(ICONService, 'sendNativeCoin');

      const result = await transfer(
        { value: amount, network: harmonyChain.network, to: toAddress },
        true,
      );

      expect(mock_sendNativeCoin).toBeCalledTimes(1);
      expect(result).toEqual({
        transaction: { value: amount, to: harmonyChain.ICON_BTS_CORE },
        options: {
          builder: expect.anything(),
          method: 'transferNativeCoin',
          params: { _to: `btp://${harmonyChain.NETWORK_ADDRESS}/${toAddress}` },
        },
      });
      expect(window[signingActions.globalName]).toBe(signingActions.transfer);
    });

    test('setApproveForSendNonNativeCoin', async () => {
      const mock_setApproval = jest.spyOn(ICONService, 'setApproveForSendNonNativeCoin');
      const tokenBSHAddress = 'xyz';
      jest.spyOn(utils, 'makeICXCall').mockImplementation(() => Promise.resolve(tokenBSHAddress));

      const tx = {
        coinName: harmonyChain.COIN_SYMBOL,
        value: amount,
        network: harmonyChain.network,
      };
      const result = await transfer(tx, false, harmonyChain.COIN_SYMBOL);

      expect(mock_setApproval).toBeCalledTimes(1);
      expect(tx).toEqual(window[txPayload]);
      expect(result).toEqual({
        transaction: { to: tokenBSHAddress },
        options: {
          builder: expect.anything(),
          method: 'approve',
          params: {
            spender: harmonyChain.ICON_BTS_CORE,
            amount: IconConverter.toHex(utils.convertToLoopUnit(amount)),
          },
        },
      });
    });

    test('sendNonNativeCoin', async () => {
      jest.spyOn(utils, 'makeICXCall').mockImplementation(() => {});

      const tx = {
        coinName: harmonyChain.COIN_SYMBOL,
        value: amount,
        network: harmonyChain.network,
        to: toAddress,
      };

      await ICONService.setApproveForSendNonNativeCoin(tx);
      const result = ICONService.sendNonNativeCoin();

      expect(tx).toEqual(window[txPayload]);
      expect(window[signingActions.globalName]).toBe(signingActions.transfer);
      expect(result).toEqual({
        transaction: { to: harmonyChain.ICON_BTS_CORE },
        options: {
          builder: expect.anything(),
          method: 'transfer',
          params: {
            _coinName: harmonyChain.COIN_SYMBOL,
            _to: `btp://${harmonyChain.NETWORK_ADDRESS}/${toAddress}`,
            _value: IconConverter.toHex(utils.convertToLoopUnit(amount)),
          },
        },
      });
    });

    test('transferIRC2', async () => {
      const tx = {
        coinName: harmonyChain.COIN_SYMBOL,
        value: amount,
        to: toAddress,
        network: harmonyChain.network,
      };

      ICONService.approveIRC2(tx);
      const result = ICONService.sendNonNativeCoin();

      expect(window[signingActions.globalName]).toBe(signingActions.transfer);
      expect(result).toEqual({
        transaction: { to: harmonyChain.ICON_BTS_CORE },
        options: {
          builder: expect.anything(),
          method: 'transfer',
          params: {
            _to: `btp://${harmonyChain.NETWORK_ADDRESS}/${toAddress}`,
            _coinName: harmonyChain.COIN_SYMBOL,
            _value: IconConverter.toHex(utils.convertToLoopUnit(amount)),
          },
        },
      });
    });
  });

  describe('getBalanceOf', () => {
    test('refundable', async () => {
      const symbol = 'ONE';
      const ONEBSHAddress = 'abc';
      jest
        .spyOn(constants, 'getCurrentChain')
        .mockImplementation(() => ({ methods: { getBalanceOf: {} } }));
      jest.spyOn(utils, 'getICONBSHAddressforEachChain').mockImplementation(() => ONEBSHAddress);
      const mock_makeICXCall = jest
        .spyOn(utils, 'makeICXCall')
        .mockImplementation(() => Promise.resolve({ refundable: '0x29e46e036aab4e8b00' }));

      const balance = await ICONService.getBalanceOf({
        refundable: true,
        symbol,
        address: toAddress,
      });

      expect(balance).toBe('772.776604466852825856');
      expect(mock_makeICXCall).toHaveBeenCalledWith({
        data: {
          method: 'balanceOf',
          params: { _coinName: symbol, _owner: toAddress },
        },
        dataType: 'call',
        to: ONEBSHAddress,
      });
    });
  });
});
