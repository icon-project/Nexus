import React from 'react';

import Dropdown from './Dropdown';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
};

const items = [
  { title: 'Item 1', icon: <UserOutlined />, path: '/item1' },
  { title: 'Item 2', icon: <UserOutlined />, path: '/item2', hasDivider: true },
  { title: 'Item 3', icon: <UserOutlined />, path: '/item3' },
];

const Template = (args) => (
  <Dropdown items={items} {...args}>
    <Button>Dropdown</Button>
  </Dropdown>
);

export const Default = Template.bind({});
