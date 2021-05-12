import Footer from './Footer';

export default {
  title: 'Components/Footer',
  component: Footer,
};

const Template = (args) => <Footer {...args} />;

export const YearIsAString = Template.bind({});
YearIsAString.argTypes = {
  year: { control: 'text' },
};

export const YearIsANumber = Template.bind({});
YearIsANumber.argTypes = {
  year: { control: 'number' },
};
