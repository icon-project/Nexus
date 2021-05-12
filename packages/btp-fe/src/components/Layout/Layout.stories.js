import React from 'react';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Layout from './Layout';

export default {
  title: 'Layouts/Layout',
  component: Layout,
};

const breadcrumbItems = [
  { title: 'Home', link: '/' },
  { title: 'List', link: '/' },
  { title: 'App', link: '/' },
];

const items = [
  { title: 'sub1', icon: <UserOutlined />, path: '/abc' },
  {
    title: 'subnav 2',
    icon: <LaptopOutlined />,
    subMenu: [
      { title: 'option5', icon: <LaptopOutlined />, path: '/abc' },
      { title: 'option6', icon: <NotificationOutlined />, path: '/abc' },
    ],
  },
  {
    title: 'subnav 3',
    icon: <LaptopOutlined />,
    subMenu: [
      { title: 'option7', path: '/abc' },
      { title: 'option8', path: '/abc' },
    ],
  },
];

const Template = () => <Layout breadcrumbItems={breadcrumbItems} menuList={items} />;

export const Default = Template.bind({});
