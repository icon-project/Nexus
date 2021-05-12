import React from 'react';
import i18n from '../../i18n';
import { Table as AntTable, Input, Button, Space } from 'antd';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const InputStyle = styled(Input)`
  width: 188px;
  margin-bottom: 8px;
`;
const ButtonStyle = styled(Button)`
  width: 90px;
`;

const FilterContainer = styled.div`
  padding: 8px;
  width: min-content;
`;
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const getColumnSearchProps = (dataIndex) => ({
  // eslint-disable-next-line react/display-name
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <FilterContainer>
      <InputStyle
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={confirm}
      />
      <Space>
        <ButtonStyle type="primary" onClick={confirm} size="small">
          {i18n.t('table.search', 'Search')}
        </ButtonStyle>
        <ButtonStyle onClick={clearFilters} size="small">
          {i18n.t('table.reset', 'Reset')}
        </ButtonStyle>
      </Space>
    </FilterContainer>
  ),
  // eslint-disable-next-line react/display-name
  filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : '',
});

const Table = ({ columns, multiSelect, onPageChange, onShowSizeChange, ...rest }) => {
  return (
    <AntTable
      columns={columns.map((col) =>
        col.filter ? Object.assign(col, getColumnSearchProps(col.dataIndex)) : col,
      )}
      pagination={{
        onChange: onPageChange,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        onShowSizeChange,
      }}
      rowSelection={
        multiSelect && {
          type: 'checkbox',
          ...rowSelection,
        }
      }
      {...rest}
    />
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      /**
       * attribute name of data
       */
      dataIndex: PropTypes.string,
      /**
       * comparator function
       * Example: (a, b) => a - b
       */
      sorter: PropTypes.func,
      /**
       * Filter enable
       */
      filter: PropTypes.bool,
    }),
  ),
  /**
   * This props add a checkbox row selection to table
   */
  multiSelect: PropTypes.bool,
  /**
   * event happens when the user changes page<br/>
   * Handle this event to setup paging on server-side
   */
  onPageChange: PropTypes.func,
  /**
   * on page size change
   */
  onShowSizeChange: PropTypes.func,
};

Table.defaultProps = {
  columns: [],
  multiSelect: false,
};

export default Table;
