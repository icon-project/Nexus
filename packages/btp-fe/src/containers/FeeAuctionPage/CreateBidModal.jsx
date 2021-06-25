import { Form as FinalForm, Field } from 'react-final-form';
import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { Modal } from 'components/NotificationModal';
import { TextInput } from 'components/Input';
import { PrimaryButton, Button } from 'components/Button';
import { SelectInput } from 'components/Select/SelectInput';
import { colors } from 'components/Styles/Colors';

import { minValue, composeValidators } from 'utils/inputValidation';

const Form = styled.form`
  text-align: left;
  margin-top: 37px;

  .input-field {
    margin-bottom: 32px;

    p.small {
      margin-bottom: 6px;
    }
  }

  .control-buttons {
    display: flex;
    justify-content: space-between;
  }
`;

export const CreateBidModal = () => {
  const onSubmit = (values) => {
    console.log('🚀 ~ file: CreateBidModal.jsx ~ line 6 ~ onSubmit ~ values', values);
  };

  const assets = [
    { value: 'bsc', label: 'BTC' },
    { value: 'ed', label: 'ETH' },
    { value: 'ic', label: 'SHIBA' },
  ];

  return (
    <Modal title="New bid" display hasClosedBtn={false}>
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
              <div className="input-group">
                <div className="input-field">
                  <Text className="small">Asset type</Text>
                  <SelectInput options={assets} />
                </div>

                <div className="input-field">
                  <Text className="small">Bid amount</Text>
                  <Field
                    name="bidAmount"
                    validate={composeValidators(
                      minValue(100, 'Minimum bid is 100 ICX. Please input again'),
                    )}
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
                >
                  Cancel
                </Button>
                <PrimaryButton htmlType="submit" disabled={!valid} width={192} height={64}>
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
