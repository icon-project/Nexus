import handleCheckingApproval from '../handleCheckingApproval';
import { PAIRED_NETWORKS, pairedNetworks } from 'utils/constants';
import { getService } from 'services/transfer';

jest.mock('services/transfer', () => {
  return {
    getService: jest.fn(() => ({
      setApprovalForAll: jest.fn().mockImplementation(() => {}),
    })),
  };
});

describe('components/TransferCard', () => {
  describe('handleCheckingApproval', () => {
    const mockSetStep = jest.fn();
    const mockOpenModal = jest.fn((params) => params);

    afterEach(() => {
      mockSetStep.mockReset();
      mockOpenModal.mockReset();
    });

    test('sending native coin', () => {
      handleCheckingApproval(mockSetStep, true);

      expect(mockSetStep).toBeCalledTimes(1);
    });

    test('is ICON-BSC chains', () => {
      localStorage.setItem(PAIRED_NETWORKS, pairedNetworks['ICON-BSC']);
      handleCheckingApproval(mockSetStep, true);

      expect(mockSetStep).toBeCalledTimes(1);
    });

    test('has been approved', async () => {
      localStorage.setItem(PAIRED_NETWORKS, pairedNetworks['ICON-Moonbeam']);
      getService.mockImplementationOnce(() => ({
        isApprovedForAll: jest.fn().mockResolvedValueOnce(true),
      }));
      await handleCheckingApproval(mockSetStep, false, 'icon', mockOpenModal);

      expect(mockSetStep).toBeCalledTimes(1);
    });

    test('has NOT been approved', async () => {
      localStorage.setItem(PAIRED_NETWORKS, pairedNetworks['ICON-Moonbeam']);
      getService.mockImplementationOnce(() => ({
        isApprovedForAll: jest.fn().mockResolvedValueOnce(false),
      }));
      await handleCheckingApproval(mockSetStep, false, 'icon', mockOpenModal);

      expect(mockSetStep).toBeCalledTimes(0);
      expect(mockOpenModal).toBeCalledTimes(1);
      expect(mockOpenModal.mock.calls[0][0].isSetApprovalForAllModal).toBe(true);
    });
  });
});
