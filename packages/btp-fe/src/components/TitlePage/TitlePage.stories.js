import { TitlePage } from './TitlePage';

export default {
  title: 'Components/TitlePage',
  component: TitlePage,
};

export const Default = (args) => (
  <div style={{ minHeight: '100vh' }}>
    <TitlePage titleText="User List" {...args} />
  </div>
);
