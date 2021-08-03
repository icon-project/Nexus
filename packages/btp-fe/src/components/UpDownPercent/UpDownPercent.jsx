import { memo } from 'react';
import styled from 'styled-components/macro';

import { colors } from '../Styles/Colors';
import { Text } from '../Typography';

import upIcon from '../../assets/images/up-percent-icon.svg';
import downIcon from '../../assets/images/down-percent-icon.svg';

const Wrapper = styled(Text)`
  color: ${({ up }) => (up ? colors.successState : colors.errorState)} !important;
  display: inline-block;

  img {
    margin-right: ${({ sm }) => (sm ? '5.67px' : '6.08px')};
  }
  span {
    font-size: ${({ sm }) => sm && '12px'};
    display: inline-block;

    &.label {
      color: ${colors.graySubText};
      margin-left: 6px;
    }
  }
`;

export const UpDownPercent = memo(({ percent = 0, sm = false, label = 'in 24h' }) => {
  const isUp = percent >= 0;
  return (
    <Wrapper up={isUp} sm={sm} className="sm percent">
      <img src={isUp ? upIcon : downIcon} alt="icon" />
      <span>{Math.abs(percent)}%</span>
      <span className="label">{label}</span>
    </Wrapper>
  );
});

UpDownPercent.displayName = 'UpDownPercent';
