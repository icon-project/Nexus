import { memo } from 'react';
import styled from 'styled-components/macro';
import { Form as FinalForm, Field } from 'react-final-form';

import { Header, SubTitle, Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { TextInput } from 'components/Input';
import { PrimaryButton } from 'components/Button';

import { useDispatch } from '../../hooks/useRematch';
import { minValue, composeValidators } from 'utils/inputValidation';
import { placeBid } from '../../connectors/ICONex/iconService';

const Form = styled.form`
  background-color: ${colors.grayBG};
  padding: 23px 31px 32px;
  text-align: center;

  .header-text.xs {
    margin-bottom: 22px;
  }

  .plain-text.xs {
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

export const PlaceBidForm = memo(({ currentBidAmount, auctionName }) => {
  const minimumIncrementalBid = currentBidAmount + currentBidAmount * 0.1;

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
      placeBid(auctionName, bidAmount);
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
            <Header className="xs bold">Place a new bid</Header>
            <Text className="xs">
              Minimum bid: <span>100 ICX</span>
            </Text>
            <Text className="xs">
              Minimum incremental bid: <span>10%</span> higher than the current bid
            </Text>

            <div className="input-group">
              <Text className="sm">New bid</Text>
              <Field
                name="bidAmount"
                validate={composeValidators(
                  minValue(100, 'Minimum bid is 100 ICX. Please input again'),
                  minValue(
                    minimumIncrementalBid,
                    'Minimum incremental bid is ' + minimumIncrementalBid + ' ICX.',
                  ),
                )}
                render={({ input, meta }) => (
                  <TextInput placeholder="Input amount" type="number" {...input} meta={meta} />
                )}
              />
            </div>

            <PrimaryButton htmlType="submit" disabled={!valid || !currentBidAmount}>
              <SubTitle className="sm bold">Place bid</SubTitle>
            </PrimaryButton>
          </Form>
        );
      }}
    />
  );
});

PlaceBidForm.displayName = 'PlaceBidForm';
