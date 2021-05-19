import { TransferBox } from './TransferBox';

export default {
  title: 'Components/TransferBox',
  component: TransferBox,
};

const TransferBoxTemplate = (args) => <TransferBox {...args} />;

export const Default = TransferBoxTemplate.bind({});
