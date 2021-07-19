import styled from 'styled-components/macro';
import { Select } from 'components/Select';
import { colors } from 'components/Styles/Colors';
import { Text } from 'components/Typography';

const StyledSelect = styled(Select)`
  width: ${({ width }) => width || '256px'};
  height: 44px;
  justify-content: space-between;
  border: 1px solid ${colors.grayLine};
  padding: 10px 16px;
  background-color: transparent !important;
  img {
    width: 24px;
  }
  ul {
    width: 90%;
  }
`;

const Wrapper = styled.div`
  display: block;
  .label {
    margin-bottom: 8px;
  }
`;

const SelectWithBorder = ({ width, label, ...props }) => {
  return (
    <Wrapper>
      <Text className="small label">{label}</Text>
      <StyledSelect width={width} {...props} />
    </Wrapper>
  );
};
export default SelectWithBorder;
