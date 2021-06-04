import { memo } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components/macro';

import metaMaskIcon from '../../assets/images/metal-mask.svg';
import iconexIcon from '../../assets/images/icon-ex.svg';
import ethIcon from '../../assets/images/eth-icon.svg';
import copyIcon from '../../assets/images/blue-copy-icon.svg';
import binanceIcon from '../../assets/images/binance-icon.svg';
import edgewareIcon from '../../assets/images/edgeware-icon.png';
import btcIcon from '../../assets/images/btc-icon.svg';

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
    binance: binanceIcon,
    edgeware: edgewareIcon,
    btc: btcIcon,
  };

  return (
    <StyledIcon src={icons[icon]} alt="wallet icon" loading="lazy" width={width} size={size} />
  );
});

Icon.displayName = 'Icon';

Icon.propTypes = {
  icon: PropTypes.oneOf(['metaMask', 'iconex', 'eth', 'copy', 'binance', 'edgeware', 'btc']),
  size: PropTypes.oneOf(['s', 'm']),
};
