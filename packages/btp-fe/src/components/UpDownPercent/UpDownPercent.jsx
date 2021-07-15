import { memo } from 'react';
import styled from 'styled-components/macro';

import { colors } from '../Styles/Colors';
import { Text } from '../Typography';

import upIcon from '../../assets/images/up-percent-icon.svg';
import downIcon from '../../assets/images/down-percent-icon.svg';

const Wrapper = styled(Text)`
  color: ${({ up }) => (up ? colors.successState : colors.errorState)};
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

export const UpDownPercent = memo(({ percent = '9.55%', up = true, sm = false }) => {
  return (
    <Wrapper up={up} sm={sm} className="small percent">
      <img src={up ? upIcon : downIcon} alt="icon" />
      <span>{percent}</span>
      <span className="label">in 24h</span>
    </Wrapper>
  );
});

UpDownPercent.displayName = 'UpDownPercent';
