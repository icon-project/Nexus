import { getCurrentTransferService } from '../transfer';
import { wallets, connectedNetWorks, PAIRED_NETWORKS, pairedNetworks } from 'utils/constants';

jest.mock('store', () => {
  return {
    getState: jest.fn().mockImplementation(() => ({ account: { wallet: '' } })),
    dispatch: jest.fn().mockImplementation(() => ({ modal: {} })),
  };
});

describe('services/transfer', () => {
  test('Metamask wallet + ICON-BSC pair', () => {
    localStorage.setItem(PAIRED_NETWORKS, pairedNetworks['ICON-BSC']);

    const service = getCurrentTransferService()(wallets.metamask);
    expect(service.serviceName).toBe(connectedNetWorks.bsc);
  });

  test('Metamask wallet + ICON-Moonbeam pair', () => {
    localStorage.setItem(PAIRED_NETWORKS, pairedNetworks['ICON-Moonbeam']);

    const service = getCurrentTransferService()(wallets.metamask);
    expect(service.serviceName).toBe(connectedNetWorks.moonbeam);
  });

  test('ICONex wallet', () => {
    localStorage.setItem(PAIRED_NETWORKS, pairedNetworks['ICON-BSC']);

    const service = getCurrentTransferService()(wallets.iconex);
    expect(service.serviceName).toBe(connectedNetWorks.icon);
  });
});
