import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { SubTitleMixin } from 'components/Typography/SubTitle';
import { colors } from 'components/Styles/Colors';

const ButtonStyle = styled.button`
  ${SubTitleMixin.mdBold};
  border-radius: ${(props) => props.$borderRadius};
  border: none;
  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$textColor};
  width: ${(props) => props.$width || ''};
  height: ${(props) => props.$height || ''};
  border: solid ${({ $borderColor }) => ($borderColor ? `1px ${$borderColor}` : '0 transparent')};

  &:hover {
    background-color: ${(props) => props.$backgroundColor};
    color: ${(props) => props.$textColor};
    border: solid ${({ $borderColor }) => ($borderColor ? `1px ${$borderColor}` : '0 transparent')};
  }

  &:disabled {
    color: ${(props) => props.$disabledTextColor ?? colors.grayScaleSubText};
    background-color: ${(props) => props.$disabledBackgroundColor ?? colors.grayScaleDisabled};
    cursor: 'not-allowed';
  }
`;
const Button = ({
  height,
  width,
  backgroundColor,
  textColor,
  children,
  borderRadius,
  borderColor,
  className,
  disabled,
  disabledBackgroundColor,
  ...rest
}) => {
  return (
    <ButtonStyle
      $height={`${height}px`}
      $width={`${width}px`}
      $borderRadius={`${borderRadius}px`}
      $backgroundColor={backgroundColor}
      $textColor={textColor}
      $borderColor={borderColor}
      className={className}
      disabled={disabled}
      disabledBackgroundColor={disabledBackgroundColor}
      {...rest}
    >
      {children}
    </ButtonStyle>
  );
};

Button.propTypes = {
  /** Background color */
  backgroundColor: PropTypes.string,
  /** Text color */
  textColor: PropTypes.string,
  /** Border color */
  borderColor: PropTypes.string,
  /** Border radius */
  borderRadius: PropTypes.number,
  /** Button height */
  height: PropTypes.number,
  /** Button width */
  width: PropTypes.number,
};

Button.defaultProps = {
  backgroundColor: colors.primaryBrand,
  textColor: colors.primaryBrandBG,
  borderRadius: 4,
};

export default Button;
