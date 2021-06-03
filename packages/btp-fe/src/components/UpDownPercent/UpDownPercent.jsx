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
    margin-right: 6.08px;
  }
`;

export const UpDownPercent = memo(({ percent = '9.55%', up = true }) => {
  return (
    <Wrapper up={up} className="small">
      <img src={up ? upIcon : downIcon} alt="icon" />
      {percent}
    </Wrapper>
  );
});

UpDownPercent.displayName = 'UpDownPercent';
