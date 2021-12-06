import { IconAmount, IconUtil, IconConverter, IconBuilder } from 'icon-sdk-js';
const { CallTransactionBuilder } = IconBuilder;
const { serialize } = IconUtil;

import { getCurrentICONexNetwork, MOON_BEAM_NODE } from 'connectors/constants';

import { signTx, sendNonNativeCoin, sendNativeCoin } from '../ICONService';

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

  test('sendNoneNativeCoin', () => {
    const value = 1;
    const to = 'bob';

    const transaction = {
      to: getCurrentICONexNetwork().BSHAddress,
    };

    const options = {
      method: 'transfer',
      params: {
        _to: `btp://${MOON_BEAM_NODE.networkAddress}/${to}`,
        _value: IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()),
        _coinName: 'DEV',
      },
    };

    const result = sendNonNativeCoin({ to, value });
    delete result.options.builder;

    expect(result.transaction).toEqual(transaction);
    expect(result.options).toEqual(options);
  });

  test('sendNativeCoin', () => {
    const value = 1;
    const to = 'bob';
    const networkAddress = 'icon.21';

    const transaction = {
      to: getCurrentICONexNetwork().BSHAddress,
      value,
    };

    const options = {
      method: 'transferNativeCoin',
      params: {
        _to: `btp://${networkAddress}/${to}`,
      },
    };

    const result = sendNativeCoin({ to, value }, networkAddress);
    delete result.options.builder;

    expect(result.transaction).toEqual(transaction);
    expect(result.options).toEqual(options);
  });
});
