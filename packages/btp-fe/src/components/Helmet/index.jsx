import { memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet as ReactHelmet } from 'react-helmet-async';

export const Helmet = memo(({ title, children }) => {
  return (
    <ReactHelmet>
      <title>BTP - {title}</title>
      {children}
    </ReactHelmet>
  );
});

Helmet.displayName = 'Helmet';

Helmet.propTypes = {
  /** Subtitle */
  title: PropTypes.string.isRequired,
};
