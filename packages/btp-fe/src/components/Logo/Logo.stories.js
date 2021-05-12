import Logo from './Logo';
import { LOGO_APP } from '../../utils/constants';

export default {
  title: 'Components/Logo',
  component: Logo,
};

const Template = (args) => <Logo imageUrl={LOGO_APP} {...args} />;

export const Default = Template.bind({});
