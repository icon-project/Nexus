import Avatar from './Avatar';
export default {
  title: 'Components/Avatar',
  component: Avatar,
};

const dummyUpload = ({ file, onSuccess, onError }) => {
  console.log('Upload file', file);
  //handle upload here
  const success = true;
  setTimeout(() => {
    if (success) {
      onSuccess();
    } else {
      onError();
    }
  }, 0);
};

const Template = (args) => <Avatar onUpload={dummyUpload} {...args} />;

export const Default = Template.bind({});
