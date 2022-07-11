import { IconUtil, IconConverter, IconBuilder } from 'icon-sdk-js';
const { CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { signingActions } from 'connectors/constants';
import { chainConfigs } from 'connectors/chainConfigs';

import * as ICONService from '../ICONServices';
import { transfer } from '../transfer';
import * as utils from '../utils';

const amount = 10;
const toAddress = '0x07841E2b76dA0C527f5A446a7e3164Be5ec747c5';
const harmonyChain = {
  network: 'HARMONY',
  ICON_BSH_ADDRESS: 'cxe24a2f5f46227ba91962d172945875c805f63e63',
  NETWORK_ADDRESS: '0x6357d2e0.hmny',
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

describe('ICONService', () => {
  test('signTx', () => {
    const transactions = { from: 'alice', to: 'bob', value: 1 };
    const options = {
      builder: new CallTransactionBuilder(),
      method: 'transfer',
      params: { _coinName: 'DEV' },
      nid: '0x58eb1c',
      timestamp: '123',
    };

    const txBuilder = new CallTransactionBuilder();

    const tx = txBuilder
      .from(transactions.from)
      .to(transactions.to)
      .stepLimit(IconConverter.toBigNumber(chainConfigs.ICON?.STEP_LIMIT))
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
      Object.defineProperty(chainConfigs, harmonyChain.network, harmonyChain);

      const result = await transfer(
        { value: amount, network: harmonyChain.network, to: toAddress },
        true,
      );

      expect(mock_sendNativeCoin).toBeCalledTimes(1);
      expect(result).toEqual({
        transaction: { value: amount, to: harmonyChain.ICON_BSH_ADDRESS },
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

      const result = await transfer(
        { coinName: 'ICX', value: amount, network: harmonyChain.network },
        false,
        'ICX',
      );

      expect(mock_setApproval).toBeCalledTimes(1);
      expect(result).toEqual({
        transaction: { to: tokenBSHAddress },
        options: {
          builder: expect.anything(),
          method: 'approve',
          params: {
            spender: harmonyChain.ICON_BSH_ADDRESS,
            amount: IconConverter.toHex(utils.convertToLoopUnit(amount)),
          },
        },
      });
    });
  });
});
