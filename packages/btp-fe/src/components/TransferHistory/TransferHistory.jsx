/* eslint-disable react/display-name */
import styled from 'styled-components';
import { Table, Row } from 'antd';
import { Tag } from 'components/Tag';
import { SelectAsset } from 'components/Select';
import VectorSrc from 'assets/images/vector.svg';
const TableStyled = styled(Table)`
  margin-top: 34px;
  .ant-table-content {
    font-family: Poppins;
  }
  .ant-table-tbody {
    background-color: #131217;
    color: #eff1ed;
    font-size: 16px;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #353242;
  }
  .ant-table-thead > tr > th {
    background: #312f39;
    font-size: 14px;
    color: #eff1ed;
    border-bottom: none;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: #1d1b22;
  }
  .select-asset-container {
    margin-bottom: 34px;
  }
  .details-column {
    width: 448px;
  }
  .time-column {
    width: 148px;
  }
  .amount-column {
    width: 268;
  }
  .ant-pagination-item-active,
  .ant-pagination-item,
  .ant-pagination-item-link {
    font-family: Poppins;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    width: 36px;
    height: 36px;
  }
  .ant-pagination-item,
  .ant-pagination-item-link {
    border: 1px solid #99a3ff;
    background: transparent;
    a {
      color: #99a3ff;
    }
  }
  .ant-pagination-item-active {
    border: none;
    background: #5465ff;
    a {
      color: #ebedff;
    }
  }
`;
const columns = [
  {
    title: 'Details',
    dataIndex: 'details',
    render: (text) => <div className="details-column">{text}</div>,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    render: (text) => <div className="time-column">{text}</div>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (text) => <div className="amount-column">{text}</div>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 160,
    render: (text) => {
      let color = '#5EF38C';
      switch (text) {
        case 'pending':
          color = '#FFBA49';
          break;
        case 'failed':
          color = '#F05365';
          break;
      }
      return <Tag color={color}>{text}</Tag>;
    },
  },
];
const dataSource = [];
for (let i = 0; i < 30; i++) {
  dataSource.push({
    key: i,
    details: '0x7859eef12402fba1fe05205194be861f2cfd97eaf5b3eeeb7787c0e8d393e480',
    time: i < 3 ? '55sec ago' : '1min ago',
    amount: i < 4 ? '0.000789 Ether' : '0.018184755491286 Ether',
    status: i === 5 ? 'failed' : i < 1 ? 'pending' : 'success',
  });
}

const TransferHistoryStyled = styled.div`
  font-family: Poppins;
  margin-top: 31px;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.75px;
  color: #eff1ed;
  width: 1120px;
  .custom-select-wrapper {
    width: 204px;
  }
`;

export const TransferHistory = () => {
  return (
    <TransferHistoryStyled>
      <Row>
        Viewing transfer history for
        <SelectAsset />
        <img src={VectorSrc} />
        <SelectAsset />
      </Row>
      <TableStyled
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </TransferHistoryStyled>
  );
};
