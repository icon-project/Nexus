import React from 'react';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

import Header from './Header';

export default {
  title: 'Components/Header',
  component: Header,
};

const items = [
  { title: 'My Profile', icon: <UserOutlined />, path: '/abc' },
  { title: 'Setting', icon: <SettingOutlined />, path: '/abc', hasDivider: true },
  { title: 'Logout', icon: <LogoutOutlined />, path: '/abc' },
];

const Template = (args) => <Header items={items} userName="Admin" {...args} />;

export const Default = Template.bind({});
