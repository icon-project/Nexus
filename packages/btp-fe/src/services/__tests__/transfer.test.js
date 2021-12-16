import { getCurrentTransferService } from '../transfer';
import { wallets, connectedNetWorks } from 'utils/constants';

jest.mock('store', () => {
  return {
    getState: jest.fn().mockImplementation(() => ({ account: { wallet: '', currentNetwork: '' } })),
    dispatch: { modal: {} },
  };
});

describe('services/transfer', () => {
  test('Metamask wallet + ICON-BSC pair', () => {
    const service = getCurrentTransferService()(wallets.metamask, connectedNetWorks.bsc);
    expect(service.serviceName).toBe(connectedNetWorks.bsc);
  });

  test('Metamask wallet + ICON-Moonbeam pair', () => {
    const service = getCurrentTransferService()(wallets.metamask, connectedNetWorks.moonbeam);
    expect(service.serviceName).toBe(connectedNetWorks.moonbeam);
  });

  test('ICONex wallet', () => {
    const service = getCurrentTransferService()(wallets.iconex, connectedNetWorks.bsc);
    expect(service.serviceName).toBe(connectedNetWorks.icon);
  });
});
