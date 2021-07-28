import { useEffect, useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { Modal } from 'components/NotificationModal';
import { TextInput } from 'components/Input';
import { PrimaryButton, Button } from 'components/Button';
import { SelectInput } from 'components/Select/SelectInput';
import { colors } from 'components/Styles/Colors';

import { minValue, required } from 'utils/inputValidation';
import { placeBid } from 'connectors/ICONex/iconService';
import { useListenForSuccessTransaction } from 'hooks/useListenForSuccessTransaction';

const Form = styled.form`
  text-align: left;
  margin-top: 27px;

  .input-field {
    margin-bottom: 32px;

    .plain-text.sm {
      margin-bottom: 6px;
    }
  }

  .control-buttons {
    display: flex;
    justify-content: space-between;
  }
`;

export const CreateBidModal = ({ setOpen, availableAssets, getAvailableAssets, openModal }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAvailableAssets().then(() => {
      setLoading(false);
    });
  }, [getAvailableAssets]);

  useListenForSuccessTransaction(() => {
    setOpen(false);
  });

  const onSubmit = (values) => {
    const { bidAmount, auctionName } = values;
    if (bidAmount && auctionName) {
      openModal({
        icon: 'loader',
        desc: 'Waiting for confirmation in your wallet.',
      });
      placeBid(auctionName, bidAmount);
    }
  };

  return (
    <Modal title="New bid" display hasClosedBtn={false}>
      <FinalForm
        onSubmit={onSubmit}
        render={({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-field">
                  <Text className="sm">Asset type</Text>
                  <Field
                    name="auctionName"
                    validate={required}
                    render={({ input, meta }) => (
                      <SelectInput
                        options={availableAssets}
                        loading={loading}
                        {...input}
                        meta={meta}
                      />
                    )}
                  />
                </div>

                <div className="input-field">
                  <Text className="sm">Bid amount</Text>
                  <Field
                    name="bidAmount"
                    validate={minValue(100, 'Minimum bid is 100 ICX. Please input again')}
                    render={({ input, meta }) => (
                      <TextInput
                        placeholder="Place a bid higher than 100 ICX"
                        type="number"
                        {...input}
                        meta={meta}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="control-buttons">
                <Button
                  width={192}
                  height={64}
                  borderColor={colors.primaryBrandLight}
                  backgroundColor="transparent"
                  textColor={colors.primaryBrandLight}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <PrimaryButton htmlType="submit" width={192} height={64}>
                  Create new bid
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    </Modal>
  );
};
