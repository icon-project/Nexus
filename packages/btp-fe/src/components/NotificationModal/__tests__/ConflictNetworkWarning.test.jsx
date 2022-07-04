import { render, screen } from '@testing-library/react';
import { ConflictNetworkWarning } from '../ConflictNetworkWarning';

test('render if has only one network', () => {
  const sourceList = [{ id: 'HARMONY' }];
  render(<ConflictNetworkWarning sourceList={sourceList} />);
  expect(
    screen.getByText(`Please configure MetaMask to connect ${sourceList[0].id} network.`),
  ).toBeInTheDocument();
});

test('render if has multi networks', () => {
  const sourceList = [{ id: 'HARMONY' }, { id: 'BSC' }];
  const matchingRegex = `(Please configure MetaMask to connect one of supported network)*(${sourceList[0].id})*(${sourceList[1].id})`;

  render(<ConflictNetworkWarning sourceList={sourceList} />);
  expect(screen.getByText(new RegExp(matchingRegex, 'i'))).toBeInTheDocument();
});
