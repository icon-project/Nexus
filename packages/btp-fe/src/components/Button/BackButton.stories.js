import { BackButton } from './BackButton';

export default {
  title: 'Components/Button/Variants',
  component: BackButton,
  parameters: {
    backgrounds: {
      default: 'default',
      values: [{ name: 'default', value: '#000' }],
    },
  },
};

const Template = (args) => <BackButton {...args}>Transfer history</BackButton>;

export const BackButtonPreview = Template.bind({});
