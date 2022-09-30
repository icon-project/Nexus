import styled from 'styled-components/macro';
import { Form as FinalForm, Field } from 'react-final-form';

import { OvalTextInput } from 'components/Input/OvalTextInput';
import { media } from 'components/Styles/Media';
import { colors } from 'components/Styles/Colors';

import lookupIcon from 'assets/images/look-up-icon.svg';

const Form = styled.form`
  display: flex;
  margin: 30px 0;

  ${media.md`
    justify-content: center;

    input {
      width: 100%;
    }

    button {
      height: 48px;
    }
  `};
`;

const SubmitButton = styled.button`
  width: 60px;
  height: 100%;

  border: solid 1px ${colors.grayLine};
  border-left: none;
  border-radius: 0 100px 100px 0;
  background: transparent center / 30% no-repeat url('${lookupIcon}');
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
            <SubmitButton type="submit" />
          </Form>
        );
      }}
    />
  );
};
