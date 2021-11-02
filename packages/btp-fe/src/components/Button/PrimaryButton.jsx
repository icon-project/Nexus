import Button from './Button';
import styled from 'styled-components/macro';
import { media } from 'components/Styles/Media';

const PrimaryButtonStyled = styled(Button)`
  :hover,
  :active,
  :focus {
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

  ${media.md`
    width: 100%;
  `};
`;

const PrimaryButton = ({ children, ...rest }) => {
  return <PrimaryButtonStyled {...rest}>{children}</PrimaryButtonStyled>;
};

export default PrimaryButton;
