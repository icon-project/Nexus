import { render, screen, act } from '@testing-library/react';
import { HistoryDetails } from '../HistoryDetails';

jest.mock('hooks/useTokenToUsd', () => {
  return { useTokenToUsd: jest.fn().mockImplementation(() => 1) };
});

jest.mock('services/btpServices', () => {
  return {
    getTransferHistoryByTxHash: jest.fn().mockResolvedValue({
      content: {
        serialNumber: '11',
        tokenName: 'ETH',
        value: 0.099,
        toAddress: 'btp://0x63564c40.hmny/0x07841E2b76dA0C527f5A446a7e3164Be5ec747c5',
        fromAddress: 'hxeffc184905bfff5db8879914690ba6e5cab2f224',
        txHash: '0xc7f33feea2df8a2fc622952443f8ce1be6a61703768af9a28e725108d488cba9',
        status: 1,
        createAt: 1656840494163,
        updateAt: 1656840510337,
        networkId: '0x1',
        blockTime: 1656840488308,
        bptFee: 0.001,
        networkFee: 0.014697,
        networkNameSrc: 'ICON',
        nativeToken: 'ICX',
        txError: '',
        networkNameDst: 'HARMONY',
      },
    }),
  };
});

test('render', async () => {
  await act(async () => {
    render(
      <HistoryDetails txHash="0xc7f33feea2df8a2fc622952443f8ce1be6a61703768af9a28e725108d488cba9" />,
    );
  });
  screen.debug();
});
