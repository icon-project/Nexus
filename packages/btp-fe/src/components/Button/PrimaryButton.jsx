import Button from './Button';
import styled from 'styled-components/macro';
import { media } from 'components/Styles/Media';
import { colors } from 'components/Styles/Colors';

const { primaryBrandLight, primaryBrandBG, grayScaleLoading, graySubText } = colors;

const PrimaryButtonStyled = styled(Button)`
  :hover,
  :active,
  :focus {
    background-color: ${primaryBrandLight};
    color: ${primaryBrandBG};
  }

  :disabled {
    background-color: ${grayScaleLoading};
    color: ${graySubText};

    :hover {
      background-color: ${grayScaleLoading};
      color: ${graySubText};
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
