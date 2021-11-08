import styled from 'styled-components/macro';
import { PrimaryButton } from 'components/Button';
import { colors } from 'components/Styles/Colors';
import { SubTitleMixin } from 'components/Typography/SubTitle';

import leftArrow from 'assets/images/blue-left-arrow.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 40px 32px 32px;

  .back-button {
    ${SubTitleMixin.mdBold};
    background-color: transparent;
    color: ${colors.tertiaryBase};

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
      <button className="back-button" onClick={onBack} type="button">
        Back
      </button>
      <StyledButton onClick={onExecute} type="submit">
        {executeLabel}
      </StyledButton>
    </Wrapper>
  );
};
