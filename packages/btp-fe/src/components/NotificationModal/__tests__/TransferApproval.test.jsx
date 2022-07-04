import { render, screen } from '@testing-library/react';
import { TransferApproval } from '../TransferApproval';

test('render', () => {
  render(<TransferApproval />);
  expect(
    screen.getByText(
      'In case you granted your permission, please wait until it has been confirmed. Or, you need to grant permission before sending none-native coins once and only first. Proceed?',
    ),
  ).toBeInTheDocument();

  expect(screen.getAllByRole('button')[0]).toHaveTextContent('Cancel');
  expect(screen.getAllByRole('button')[1]).toHaveTextContent('OK');
});
