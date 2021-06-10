import styled from 'styled-components/macro';
import { Form as FinalForm, Field } from 'react-final-form';

import { Header, SubTitle, Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { TextInput } from 'components/Input';
import { PrimaryButton } from 'components/Button';

const Form = styled.form`
  background-color: ${colors.grayBG};
  padding: 23px 31px 32px;
  text-align: center;

  h3.x-small {
    margin-bottom: 22px;
  }

  p.x-small {
    color: ${colors.graySubText};
    margin-bottom: 9px;

    span {
      color: ${colors.grayText};
    }
  }

  .input-group {
    text-align: left;
    margin: 14px 0 40px;

    input {
      height: 44px;
      margin-top: 7px;
    }
  }

  & > button[type='submit'] {
    width: 100%;
    height: 44px;
  }
`;

export const minValue = (min, msg) => (value) =>
  isNaN(value) || +value >= +min ? undefined : msg || `Should be greater than ${min}`;

export const PlaceBidForm = () => {
  const onSubmit = (values) => {
    console.log('🚀 ~ file: PlaceBidForm.jsx ~ line 45 ~ onSubmit ~ values', values);
  };
  return (
    <FinalForm
      onSubmit={onSubmit}
      render={({ handleSubmit, valid }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Header className="x-small bold">Place a new bid</Header>
            <Text className="x-small">
              Minimium bid: <span>100 ICX</span>
            </Text>
            <Text className="x-small">
              Minimium incremental bid: <span>10%</span> higher than the current bid
            </Text>

            <div className="input-group">
              <Text className="small">New bid</Text>
              <Field
                name="bidAmount"
                validate={minValue(100, 'Minimium bid is 100 ICX. Please input again')}
                render={({ input, meta }) => (
                  <TextInput placeholder="Input amount" type="number" {...input} meta={meta} />
                )}
              />
            </div>

            <PrimaryButton htmlType="submit" disabled={!valid}>
              <SubTitle className="small bold">Place bid</SubTitle>
            </PrimaryButton>
          </Form>
        );
      }}
    />
  );
};
