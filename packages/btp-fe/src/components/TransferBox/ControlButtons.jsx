import styled from 'styled-components/macro';
import { PrimaryButton } from '../Button';
import { colors } from '../Styles/Colors';

import leftArrow from '../../assets/images/blue-left-arrow.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 40px 32px 32px;

  .back-button {
    background-color: transparent;
    color: ${colors.tertiaryBase};
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;

    display: flex;
    align-items: center;

    &:before {
      content: '';
      background: no-repeat center/cover url('${leftArrow}');
      width: 8px;
      height: 14px;
      margin-right: 15.5px;
    }
  }
`;
const StyledButton = styled(PrimaryButton)`
  padding: 20px 32px;
  width: auto;
  height: auto;
`;

export const ControlButtons = ({
  onBack = () => {},
  onExecute = () => {},
  executeLabel = 'Transfer',
}) => {
  return (
    <Wrapper>
      <button className="back-button" onClick={onBack}>
        Back
      </button>
      <StyledButton onClick={onExecute}>{executeLabel}</StyledButton>
    </Wrapper>
  );
};
