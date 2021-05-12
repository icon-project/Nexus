import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../Styles/Colors';

const StyledTitlePage = styled.div`
  margin-bottom: 12px;
  color: ${colors.textColor};
  font-weight: 500;
  font-size: 2rem;
  line-height: 28px;
  padding: 0 20px;
  text-align: ${(props) => (props.align ? props.align : 'left')};
`;

export const TitlePage = ({ titleText, align }) => {
  return <StyledTitlePage align={align}>{titleText}</StyledTitlePage>;
};

TitlePage.propTypes = {
  titleText: PropTypes.string.isRequired,
  align: PropTypes.string,
};
