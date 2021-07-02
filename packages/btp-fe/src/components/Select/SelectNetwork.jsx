import styled from 'styled-components/macro';
import { Select } from 'components/Select';
import { xSmallBoldText } from 'components/Typography/Text';
import { colors } from 'components/Styles/Colors';
import arrowIcon from 'assets/images/blue-arrow-icon.svg';

const StyledSelect = styled(Select)`
  & > p.medium {
    ${xSmallBoldText};
    color: ${colors.tertiaryBase};
  }

  &:after {
    width: 10px;
    height: 10px;
  }

  li > p.small {
    ${xSmallBoldText};
  }
`;

export const SelectNetwork = (props) => {
  return <StyledSelect {...props} customeArrow={arrowIcon} />;
};
