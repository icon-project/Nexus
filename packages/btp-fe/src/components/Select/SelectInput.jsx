import styled from 'styled-components/macro';
import { Select } from 'components/Select';
import filledDownArrow from 'assets/images/filled-down-arrow.svg';

import { colors } from 'components/Styles/Colors';

const StyledSelect = styled(Select)`
  width: 100%;
  justify-content: space-between;
  border: 1px solid ${colors.grayLine};
  padding: 20px 16px;
  background-color: transparent !important;

  &:after {
    width: 12px;
    height: 10px;
  }

  ul {
    width: 100%;
    top: calc(100% - 20px);
  }
`;

export const SelectInput = (props) => {
  return <StyledSelect {...props} customeArrow={filledDownArrow} />;
};
