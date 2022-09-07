import { Modal } from './Modal';
import { FailedBidContent } from './FailedBidContent';

export default {
  title: 'Components/Notification Modal',
  component: Modal,
};

const SuccessTemplate = (args) => (
  <Modal
    icon="checkIcon"
    desc="Your transaction was submitted successfully."
    button={{ text: 'Continue transfer' }}
    display
    {...args}
  />
);

const FailureTemplate = (args) => (
  <Modal
    icon="xIcon"
    desc="Your transaction has failed. Please go back and try again."
    button={{ text: 'Back to transfer' }}
    display
    {...args}
  />
);

const FailedBidTemplate = (args) => (
  <Modal icon="xIcon" button={{ text: 'Try again' }} display {...args}>
    <FailedBidContent />
  </Modal>
);

const WaitingTemplate = () => (
  <Modal icon="loader" desc="Waiting for confirmation in your wallet." width="325px" display />
);

const ApproveTemplate = () => (
  <Modal
    icon="approveIcon"
    desc="You've approved to transfer your token! Please click the Transfer button to continue."
    display
    button={{
      text: 'Transfer',
      id: 'approve-transfer-btn',
    }}
  />
);

export const Success = SuccessTemplate.bind({});
export const Failure = FailureTemplate.bind({});
export const FailureBid = FailedBidTemplate.bind({});
export const Waiting = WaitingTemplate.bind({});
export const Approve = ApproveTemplate.bind({});
