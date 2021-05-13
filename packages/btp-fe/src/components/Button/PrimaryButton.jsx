import Button from './Button';
import styled from 'styled-components';

const PrimaryButtonStyled = styled(Button)`
  :hover {
    background-color: #99a3ff;
    color: #ebedff;
  }
  :disabled {
    background-color: #3e3c46;
    color: #878490;
    :hover {
      background-color: #3e3c46;
      color: #878490;
    }
  }
`;

const PrimaryButton = ({ children, ...rest }) => {
  return <PrimaryButtonStyled {...rest}>{children}</PrimaryButtonStyled>;
};

export default PrimaryButton;
