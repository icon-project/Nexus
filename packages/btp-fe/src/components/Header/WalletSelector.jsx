import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

import { Text } from 'components/Typography';
import { Loader } from 'components/Loader';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { Icon } from 'components/Icon';

import checkIcon from 'assets/images/check-icon.svg';

const { grayText, successState, grayAccent } = colors;

const StyledWalletItem = styled.button`
  margin: 0 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  width: 416px;
  height: 72px;
  padding: 0 28.5px;
  background: transparent;
  color: ${grayText};

  ${({ $active }) => ($active ? `background: ${grayAccent};` : '')}

  .wallet-title {
    margin-right: auto;
    margin-left: 13.3px;
  }

  span {
    grid-column: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 18px;
    color: ${successState};
  }

  &:hover {
    background: ${grayAccent};
    border-radius: 4px;
  }

  .wallet-img {
    img {
      width: inherit;
    }
  }

  ${media.md`
    width: 100%;
  `};
`;

export const WalletSelector = ({ id, icon, title, active, onClick, isCheckingInstalled }) => {
  return (
    <StyledWalletItem
      className={`${id}-wallet-selector${isCheckingInstalled ? '-checking' : ''}`}
      $active={active}
      onClick={isCheckingInstalled ? () => {} : onClick}
    >
      <Icon className="wallet-img" iconURL={icon} width="32px" />
      <Text className="md wallet-title">{title}</Text>
      {!active && isCheckingInstalled && <Loader size="25px" borderSize="3px" />}
      {active && <img src={checkIcon} alt="icon" />}
    </StyledWalletItem>
  );
};

WalletSelector.propTypes = {
  /** Is selected wallet */
  active: PropTypes.bool,
  /** Handle clicking */
  onClick: PropTypes.func,
  /** Is wallet installed*/
  isInstalled: PropTypes.bool,
  /** Is checking wallet installed */
  isCheckingInstalled: PropTypes.bool,
};
