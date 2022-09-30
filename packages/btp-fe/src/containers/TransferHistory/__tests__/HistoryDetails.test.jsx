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
        networkNameDst: '',
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

  expect(screen.getByText('Transfer details')).toBeInTheDocument();
  expect(screen.getByText('Transaction hash')).toBeInTheDocument();
  expect(screen.getByText('0xc7f3...cba9').getAttribute('href')).toMatch(
    /^https:\/\/.*\/tx\/0xc7f33feea2df8a2fc622952443f8ce1be6a61703768af9a28e725108d488cba9$/,
  );

  expect(screen.getByText('Amount')).toBeInTheDocument();

  expect(screen.getByText('Status')).toBeInTheDocument();
  expect(screen.getByText('Success')).toBeInTheDocument();

  expect(screen.getByText('Time')).toBeInTheDocument();
  expect(screen.getByText('(Jul-03-2022 04:28:08 PM +07:00)')).toBeInTheDocument();

  expect(screen.getByText('From')).toBeInTheDocument();
  expect(screen.getByText('(Unknown)')).toBeInTheDocument();

  expect(screen.getByText('To')).toBeInTheDocument();
  expect(screen.getByText('(ICON)')).toBeInTheDocument();
  expect(screen.getByText('hxeffc...f224').getAttribute('href')).toMatch(
    /^https:\/\/.*\/address\/hxeffc184905bfff5db8879914690ba6e5cab2f224$/,
  );

  expect(screen.getByText('Network fee')).toBeInTheDocument();
  expect(screen.getByText('BTP fee')).toBeInTheDocument();
});
