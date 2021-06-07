import styled from 'styled-components/macro';
import { OvalTextInput } from 'components/Input/OvalTextInput';
import { PrimaryButton } from 'components/Button';
import { SubTitle } from 'components/Typography';

const Wrapper = styled.form`
  display: flex;
  margin-bottom: 43px;

  & > button {
    height: 100%;
    margin-left: 16px;
  }
`;

export const SearchForm = () => {
  return (
    <Wrapper>
      <OvalTextInput />
      <PrimaryButton type="submit">
        <SubTitle className="small bold">Search</SubTitle>
      </PrimaryButton>
    </Wrapper>
  );
};
