import { IconAmount, IconUtil, IconConverter, IconBuilder } from 'icon-sdk-js';
const { CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { signTx } from '../ICONService';

jest.mock('store', () => {
  return {
    dispatch: {
      modal: {
        isICONexWalletConnected: jest.fn().mockImplementation(() => true),
        openModal: jest.fn(),
      },
    },
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
      .stepLimit(IconConverter.toBigNumber(1000000000))
      .nid(IconConverter.toBigNumber(options.nid))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp(options.timestamp)
      .value(IconAmount.of(transactions.value, IconAmount.Unit.ICX).toLoop())
      .method(options.method)
      .params(options.params)
      .build();

    const rawTx = IconConverter.toRawTransaction(tx);
    const hash = serialize(rawTx);

    const result = signTx(transactions, options);

    expect(result).toBe(hash);
  });
});
