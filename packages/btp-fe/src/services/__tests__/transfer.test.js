import { wallets } from 'utils/constants';
import { getService } from '../transfer';

const ICONServices = 'ICONServices';
jest.mock('connectors/ICONex/ICONServices', () => {
  return ICONServices;
});

const MoonbeamServices = 'MoonbeamServices';
jest.mock('connectors/MetaMask/services', () => {
  return MoonbeamServices;
});

describe('services/transfer', () => {
  test('getting service for Hana wallet', () => {
    const service = getService(wallets.iconex, 'ICON');
    expect(service.default).toBe(ICONServices);
  });
});

describe('services/transfer', () => {
  test('getting service for MetaMask wallet', () => {
    const service = getService(wallets.metamask, 'Harmony');
    expect(service.default).toBe(MoonbeamServices);
  });
});
