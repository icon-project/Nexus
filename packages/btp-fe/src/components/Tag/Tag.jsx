import styled from 'styled-components/macro';
import { colors } from '../Styles/Colors';
const TagStyled = styled.div`
  .tag-container {
    background-color: ${colors.grayAccent};
    border-radius: 4px;
    width: fit-content;
    height: 32px;
    font-family: Poppins;
    padding: 4px 16px;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => props.color};
    text-align: center;
    letter-spacing: 0.75px;
  }
`;
export const Tag = ({ color, children }) => {
  return (
    <TagStyled color={color}>
      <div className="tag-container">{children}</div>
    </TagStyled>
  );
};
