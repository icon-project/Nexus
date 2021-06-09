import styled from 'styled-components/macro';
import { Form as FinalForm, Field } from 'react-final-form';

import { OvalTextInput } from 'components/Input/OvalTextInput';
import { PrimaryButton } from 'components/Button';
import { SubTitle } from 'components/Typography';
import { media } from 'components/Styles/Media';

const Form = styled.form`
  display: flex;
  margin-bottom: 43px;

  & > button {
    height: 100%;
    margin-left: 16px;
  }

  ${media.md`
    flex-direction: column;

    input {
      width: 100%;
    }

    button {
      margin-left: 0;
      margin-top: 24px;
    }
  `};
`;

export const SearchForm = ({ setKeySearch }) => {
  const onSubmit = (values) => {
    setKeySearch(values.keySearch);
  };
  return (
    <FinalForm
      onSubmit={onSubmit}
      render={({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Field name="keySearch" render={({ input }) => <OvalTextInput {...input} />} />
            <PrimaryButton htmlType="submit">
              <SubTitle className="small bold">Search</SubTitle>
            </PrimaryButton>
          </Form>
        );
      }}
    />
  );
};
