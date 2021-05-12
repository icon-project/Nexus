import React from 'react';
import Table from './Table';

export default {
  title: 'Components/Table',
  component: Table,
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filter: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filter: true,
  },
];
const dataSource = [];
for (let i = 0; i < 50; i++) {
  dataSource.push({
    key: i,
    name: `Leon King ${i}`,
    age: i + 10,
    address: `${i} CMT8, D1, HCM city.`,
  });
}

const Template = (args) => {
  return <Table {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  columns,
  dataSource,
  scroll: { y: 240 } /* for fixed header */,
};
