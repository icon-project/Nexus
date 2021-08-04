import { memo } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components/macro';

import { wallets } from 'utils/constants';

import { ReactComponent as metaMaskIcon } from 'assets/images/metal-mask.svg';
import { ReactComponent as iconexIcon } from 'assets/images/icon-ex.svg';
import { ReactComponent as ethIcon } from 'assets/images/eth-icon.svg';
import { ReactComponent as copyIcon } from 'assets/images/copy-icon.svg';
import { ReactComponent as binanceIcon } from 'assets/images/binance-icon.svg';
import { ReactComponent as btcIcon } from 'assets/images/btc-icon.svg';
import { ReactComponent as bchIcon } from 'assets/images/bch-icon.svg';

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

const SVGWrapper = styled.span`
  width: ${({ width, size }) => sizes[size] || width};
  display: inline-block;
  line-height: 0;
  vertical-align: middle;

  > svg {
    width: 100%;
    height: 100%;

    path {
      ${({ color }) => (color ? `fill: ${color}` : '')}
    }
  }
`;

export const Icon = memo(
  ({ icon = 'metamask', width = '25.67px', size, iconURL, SVGComp, color }) => {
    const icons = {
      metamask: metaMaskIcon,
      ICX: iconexIcon,
      [wallets.iconex]: iconexIcon,
      ETH: ethIcon,
      copy: copyIcon,
      binance: binanceIcon,
      btc: btcIcon,
      bch: bchIcon,
    };

    const MySVG = SVGComp || (!iconURL && icons[icon]);

    return (
      <>
        {MySVG ? (
          <SVGWrapper color={color} width={width} size={size} className="icon">
            <MySVG />
          </SVGWrapper>
        ) : (
          <StyledIcon
            src={iconURL || iconexIcon}
            alt="wallet icon"
            loading="lazy"
            width={width}
            size={size}
          />
        )}
      </>
    );
  },
);

Icon.displayName = 'Icon';

Icon.propTypes = {
  size: PropTypes.oneOf(['s', 'm']),
};
