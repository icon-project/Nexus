import { Button as AntButton } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonStyle = styled(AntButton)`
  border-radius: ${(props) => props.borderRadius};
  border: none;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
const Button = ({
  height,
  width,
  backgroundColor,
  textColor,
  children,
  borderRadius,
  className,
  ...rest
}) => {
  return (
    <ButtonStyle
      height={`${height}px`}
      width={`${width}px`}
      borderRadius={`${borderRadius}px`}
      backgroundColor={backgroundColor}
      textColor={textColor}
      className={className}
      {...rest}
    >
      {children}
    </ButtonStyle>
  );
};

Button.propTypes = {
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.number,
};

Button.defaultProps = {
  backgroundColor: '#5465FF',
  textColor: '#EBEDFF',
};

export default Button;
