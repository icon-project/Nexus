import { handleFailedTx, handleError } from '../handleNotification';
import store from 'store';

jest.mock('connectors/MetaMask', () => {
  return {};
});

describe('MetaMask/handleNotification', () => {
  test('handleFailedTx', () => {
    const mock_openModal = jest.spyOn(store.dispatch.modal, 'openModal');
    const desc = 'abc';
    handleFailedTx(desc);

    const payload = {
      icon: 'xIcon',
      desc,
      button: {
        text: 'Back to transfer',
        onClick: expect.anything(),
      },
    };
    expect(mock_openModal).toBeCalledTimes(1);
    expect(mock_openModal).toHaveBeenCalledWith(payload);

    mock_openModal.mockClear();
  });

  test('handleError', () => {
    const mock_openModal = jest.spyOn(store.dispatch.modal, 'openModal');
    const error = {
      code: 4001,
    };
    handleError(error);

    const payload = {
      icon: 'exclamationPointIcon',
      desc: 'Transaction rejected.',
      button: {
        text: 'Dismiss',
        onClick: expect.anything(),
      },
    };
    expect(mock_openModal).toBeCalledTimes(1);
    expect(mock_openModal).toHaveBeenCalledWith(payload);

    mock_openModal.mockClear();
  });
});
