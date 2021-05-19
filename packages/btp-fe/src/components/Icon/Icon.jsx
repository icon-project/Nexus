import { memo } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components/macro';

import metaMaskIcon from '../../assets/images/metal-mask.svg';
import iconexIcon from '../../assets/images/vector-icon.svg';
import ethIcon from '../../assets/images/eth-icon.svg';
import copyIcon from '../../assets/images/copy-icon.svg';

const sizes = {
  s: '20px',
  m: '25.67px',
};

const StyledIcon = styled.img`
  width: ${({ width, size }) => sizes[size] || width};
`;

export const Icon = memo(({ icon = 'metaMask', width = '25.67px', size }) => {
  const icons = {
    metaMask: metaMaskIcon,
    iconex: iconexIcon,
    eth: ethIcon,
    copy: copyIcon,
  };

  return (
    <StyledIcon src={icons[icon]} alt="wallet icon" loading="lazy" width={width} size={size} />
  );
});

Icon.displayName = 'Icon';

Icon.propTypes = {
  icon: PropTypes.oneOf(['metaMask', 'iconex', 'eth', 'copy']),
  size: PropTypes.oneOf(['s', 'm']),
};
