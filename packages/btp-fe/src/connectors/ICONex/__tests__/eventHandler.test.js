import { eventHandler } from '../index';
import { TYPES, signingActions } from 'connectors/constants';
import * as ICONService from '../ICONServices';
import * as utils from 'utils/app';
import * as btpServices from 'services/btpServices';

jest.mock('store', () => {
  return {
    dispatch: {
      modal: {
        openModal: jest.fn(),
      },
    },
  };
});

describe('event handler', () => {
  test(TYPES.RESPONSE_JSON_RPC, async () => {
    const txHash = '0x2988ec449553a0d0e58f65b744f57b8dab0f7546e4daab4c3b538e4843d1e439';
    jest.spyOn(utils, 'deplay').mockImplementation(() => {});
    jest.spyOn(btpServices, 'sendLog').mockResolvedValue(true);
    window[signingActions.globalName] = signingActions.transfer;
    const mock_getTxResult = jest
      .spyOn(ICONService, 'getTxResult')
      .mockResolvedValue({ status: '0x1' });

    const event = {
      detail: {
        type: TYPES.RESPONSE_JSON_RPC,
        payload: { result: txHash },
      },
    };

    await eventHandler(event);

    expect(mock_getTxResult).toHaveBeenCalledWith(txHash);
  });
});
