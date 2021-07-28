import { colors } from 'components/Styles/Colors';
import styled from 'styled-components/macro';
import { TextMixin } from 'components/Typography/Text';
import tooltipArrow from 'assets/images/tooltip-arrow.svg';

const Wrapper = styled.div`
  position: absolute;
  padding: 4px 8px;
  background-color: #1d1b22;
  border-radius: 4px;
  border: 1px solid #43404f;
  width: ${({ width }) => `${width}px`};
  z-index: 101;
  div {
    ${TextMixin.sm}
    word-break: break-word;
    color: ${colors.grayText};
    &:last-child {
      margin-bottom: 0;
    }
  }
  &:before {
    content: '';
    display: inline-block;
    position: absolute;
  }

  &.left {
    &:before {
      content: '';
      width: 7.5px;
      height: 8.66px;
      background: transparent center / contain no-repeat url('${tooltipArrow}');
      top: 40%;
      left: -6px;
    }
  }

  &.right {
    &:before {
      content: '';
      width: 7.5px;
      height: 8.66px;
      background: transparent center / contain no-repeat url('${tooltipArrow}');
      top: 40%;
      right: -7px;
      transform: rotate(180deg);
    }
  }
  &.top {
    &:before {
      content: '';
      width: 7.5px;
      height: 8.66px;
      background: transparent center / contain no-repeat url('${tooltipArrow}');
      left: 45%;
      top: -8px;
      transform: rotate(90deg);
    }
  }

  &.bottom {
    &:before {
      content: '';
      width: 7.5px;
      height: 8.66px;
      background: transparent center / contain no-repeat url('${tooltipArrow}');
      left: 44%;
      bottom: -8px;
      transform: rotate(-90deg);
    }
  }
`;

export const Tooltip = ({ arrowPosition, direction, width, children }) => {
  return (
    <Wrapper className={direction} arrowPosition={arrowPosition} width={width}>
      <div>{children || 'Default tooltip message'}</div>
    </Wrapper>
  );
};

Tooltip.defaultProps = {
  direction: 'none',
  arrowPosition: '50%',
  width: 204,
};
