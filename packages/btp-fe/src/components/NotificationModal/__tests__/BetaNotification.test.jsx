import { render, screen } from '@testing-library/react';
import { BetaNotification } from '../BetaNotification';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

test('render', () => {
  const history = createMemoryHistory();
  render(
    <Router location={history.location} history={history}>
      <BetaNotification />
    </Router>,
  );
  expect(
    screen.getByText(
      /(Nexus is in Beta. Please use at your own risk.)*(Click here)*(for full Terms of Use.)/i,
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/terms-of-use');
});
