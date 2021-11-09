import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
};

const Template = (args) => (
  <>
    <h3>Primary button</h3>
    <Button width={416} height={64} borderRadius={4} {...args}>
      Connect wallet
    </Button>
    <h3>Primary button medium size</h3>
    <Button width={304} height={64} borderRadius={4} {...args}>
      Okay
    </Button>
    <h3>Primary button with radius</h3>
    <Button width={170} height={44} borderRadius={100} {...args}>
      Connect a Wallet
    </Button>
  </>
);

export const Default = Template.bind({});
