import styled from 'styled-components/macro';
import { Form as FinalForm, Field } from 'react-final-form';

import { Header, SubTitle, Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { TextInput } from 'components/Input';
import { PrimaryButton } from 'components/Button';

import { useDispatch } from '../../hooks/useRematch';
import { minValue } from 'utils/inputValidation';
import { placeBid } from '../../connectors/ICONex/iconService';

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

export const PlaceBidForm = () => {
  const { openModal } = useDispatch(({ modal: { openModal } }) => ({
    openModal,
  }));

  const onSubmit = (values) => {
    const { bidAmount } = values;
    if (bidAmount) {
      openModal({
        icon: 'loader',
        desc: 'Waiting for confirmation in your wallet.',
      });
      placeBid(bidAmount);
    }

    return Promise.resolve(true);
  };
  return (
    <FinalForm
      onSubmit={onSubmit}
      render={({ handleSubmit, valid, form }) => {
        return (
          <Form
            onSubmit={async (event) => {
              await handleSubmit(event);
              form.restart();
            }}
          >
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
