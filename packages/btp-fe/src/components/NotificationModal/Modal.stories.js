import { Modal } from './Modal';
export default {
  title: 'Components/Notification Modal',
  component: Modal,
};

const SuccessTemplate = (args) => (
  <Modal
    icon="checkIcon"
    desc="Your transaction was submitted successfully."
    button={{ text: 'Continue transfer' }}
    {...args}
  />
);

const FailureTemplate = (args) => (
  <Modal
    icon="xIcon"
    desc="Your transaction has failed. Please go back and try again."
    button={{ text: 'Back to transfer' }}
    {...args}
  />
);

const WaitingTemplate = () => (
  <Modal icon="loader" desc="Waiting for confirmation in your wallet." width="325px" />
);

export const Success = SuccessTemplate.bind({});
export const Failure = FailureTemplate.bind({});
export const Waiting = WaitingTemplate.bind({});
