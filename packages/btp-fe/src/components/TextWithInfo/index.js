import styled from 'styled-components/macro';
import { SubTitle } from 'components/Typography';

import { colors } from 'components/Styles/Colors';
import infoIcon from '../../assets/images/info-icon.svg';

const StyledHeading = styled(SubTitle)`
  color: ${colors.grayScaleSubText};
  margin-bottom: 10px;
`;

export const TextWithInfo = ({ children, hasInfo = true, className }) => {
  return (
    <StyledHeading className={`small bold ${className}`}>
      {children} {hasInfo && <img src={infoIcon} alt="icon" />}
    </StyledHeading>
  );
};
