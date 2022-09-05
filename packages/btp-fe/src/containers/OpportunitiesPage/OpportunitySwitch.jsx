import { Button } from 'components/Button';
import styled from 'styled-components/macro';
import { opportunityType } from './data';

const StyledSwitch = styled.div`
  display: flex;
  background: #353242;
  width: fit-content;
  border-radius: 30px;
  margin-top: 24px;

  & > span {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
  & .buttonStyle {
    padding: 9px 23px;
    width: 97px;
    border-radius: 30px;
  }
  & .right-btn {
    margin-left: -20px;
  }
  & .active-tab {
    background: #566afb;
    z-index: 10;
    animation: linear infinite alternate;
    animation-name: run;
    animation-duration: 2s;
  }
  & .not-active {
    background: #353242;
    z-index: 1;
  }

  @-webkit-keyframes run {
    0% {
      left: 0;
      transform: translateX(0);
    }
    100% {
      left: 100%;
      transform: translateX(-100%);
    }
  }
`;

export const OpportunitySwitch = ({ handleChangeOpportunityType, selectedOpportunityType }) => {
  return (
    <StyledSwitch onClick={handleChangeOpportunityType}>
      <Button
        onClick={handleChangeOpportunityType}
        className={`buttonStyle  left-btn ${
          selectedOpportunityType === opportunityType.asset ? 'active-tab' : 'not-active'
        }`}
      >
        {opportunityType.asset}
      </Button>
      <Button
        onClick={handleChangeOpportunityType}
        className={`buttonStyle right-btn ${
          selectedOpportunityType === opportunityType.pool ? 'active-tab' : 'not-active'
        }`}
      >
        {opportunityType.pool}
      </Button>
    </StyledSwitch>
  );
};
