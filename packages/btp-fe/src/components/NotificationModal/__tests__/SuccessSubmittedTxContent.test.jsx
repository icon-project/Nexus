import { render, screen } from '@testing-library/react';
import { SuccessSubmittedTxContent } from '../SuccessSubmittedTxContent';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

test('render', () => {
  const history = createMemoryHistory();
  const txHash = 'abc';
  render(
    <Router location={history.location} history={history}>
      <SuccessSubmittedTxContent txHash={txHash} />
    </Router>,
  );
  expect(screen.getByText(/^Your transaction was submitted successfully.$/i)).toBeInTheDocument();
  expect(screen.getByText(/^View on history$/i)).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/history/' + txHash);
});
