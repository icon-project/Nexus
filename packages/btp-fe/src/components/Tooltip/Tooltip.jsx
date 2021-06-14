import { colors } from 'components/Styles/Colors';
import styled from 'styled-components/macro';
import { smallText } from 'components/Typography/Text';

const Wrapper = styled.div`
  position: absolute;
  padding: 4px 8px;
  background-color: #1d1b22;
  border-radius: 4px;
  border: 1px solid #312f39;
  width: ${({ width }) => `${width}px`};
  z-index: 101;
  div {
    ${smallText}
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
      border-style: solid;
      left: 1px;
      top: ${({ arrowPosition }) => arrowPosition};
      border-width: 4.33px 7.5px 4.33px 0;
      transform: translate(-100%, -50%);
      border-color: transparent #1d1b22;
    }
  }

  &.right {
    &:before {
      border-style: solid;
      right: 1px;
      top: ${({ arrowPosition }) => arrowPosition};
      border-width: 4.33px 0 4.33px 7.5px;
      transform: translate(100%, -50%);
      border-color: transparent transparent transparent #1d1b22;
    }
  }
  &.top {
    &:before {
      border-style: solid;
      left: ${({ arrowPosition }) => arrowPosition};
      top: 1px;
      border-width: 0px 4.33px 7.5px 4.33px;
      border-color: transparent transparent #1d1b22;
      transform: translate(-50%, -100%);
    }
  }

  &.bottom {
    &:before {
      border-style: solid;
      left: ${({ arrowPosition }) => arrowPosition};
      bottom: 1px;
      border-width: 7.5px 4.33px 0 4.33px;
      border-color: #1d1b22 transparent transparent;
      transform: translate(-50%, 100%);
    }
  }
`;

export const Tooltip = ({ arrowPosition, direction, width, children }) => {
  return (
    <Wrapper className={direction} arrowPosition={arrowPosition} width={width}>
      <div>{children}</div>
    </Wrapper>
  );
};

Tooltip.defaultProps = {
  direction: 'none',
  arrowPosition: '50%',
  width: 204,
};
