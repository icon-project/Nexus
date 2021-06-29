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
import bchIcon from 'assets/images/bch-icon.svg';

const sizes = {
  s: '20px',
  m: '25.67px',
};

const StyledIcon = styled.img`
  width: ${({ width, size }) => sizes[size] || width};
  image-rendering: -moz-crisp-edges; /* Firefox */
  image-rendering: -o-crisp-edges; /* Opera */
  image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
`;

export const Icon = memo(({ icon = 'metaMask', width = '25.67px', size, iconURL }) => {
  const icons = {
    metaMask: metaMaskIcon,
    iconex: iconexIcon,
    eth: ethIcon,
    copy: copyIcon,
    bnb: binanceIcon,
    edgeware: edgewareIcon,
    binance: btcIcon,
    bch: bchIcon,
  };

  return (
    <StyledIcon
      src={iconURL || icons[icon] || iconexIcon}
      alt="wallet icon"
      loading="lazy"
      width={width}
      size={size}
    />
  );
});

Icon.displayName = 'Icon';

Icon.propTypes = {
  size: PropTypes.oneOf(['s', 'm']),
};
