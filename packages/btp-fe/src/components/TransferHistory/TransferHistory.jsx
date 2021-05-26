/* eslint-disable react/display-name */
import { useState } from 'react';
import styled from 'styled-components';
import { Table, Row } from 'antd';

import { Header, Text } from '../Typography';

// import { Table, Row } from 'antd';
import { Tag } from 'components/Tag';
import { SelectAsset } from 'components/Select';
import VectorSrc from 'assets/images/vector.svg';
import BackIconSrc from 'assets/images/arrow-icon.svg';
import UnionSrc from 'assets/images/union.svg';
import PrevIconSrc from 'assets/images/prev-icon.svg';
import { colors } from '../Styles/Colors';
import { HistoryDetails } from './HistoryDetails';
import { media } from '../Styles/Media';

const TableStyled = styled(Table)`
  margin-top: 34px;
  .ant-table-content {
    font-family: 'Poppins';
  }
  .ant-table-tbody {
    background-color: ${colors.darkBG};
    color: ${colors.grayText};
    font-size: 16px;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #353242;
  }
  .ant-table-thead > tr > th {
    background: ${colors.grayAccent};
    font-size: 14px;
    color: ${colors.grayText};
    border-bottom: none;
    font-weight: 400;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: ${colors.grayBG};
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
  .ant-pagination-disabled {
    a,
    .anticon {
      color: ${colors.primaryBrandLight};
    }
  }
  .ant-pagination-prev,
  .ant-pagination-next {
    margin-right: 0;
  }
  .ant-pagination-item,
  .ant-pagination-item-link {
    border: 1px solid ${colors.primaryBrandLight};
    background: transparent;
    a,
    .anticon {
      color: ${colors.primaryBrandLight};
    }
    :hover {
      border: 1px solid ${colors.primaryBrandBase};
      a,
      .anticon {
        color: ${colors.primaryBrandBase};
      }
    }
  }
  .ant-pagination-item-active {
    border: none;
    background: ${colors.primaryBrandBase};
    a {
      color: ${colors.primaryBrandBG};
    }
    :hover {
      a {
        color: ${colors.primaryBrandBG};
      }
    }
  }

  ${media.md`
    .ant-table-content {
      overflow-x: auto;
    }
  `};
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
  margin-top: 36px;
  margin-bottom: 43px;

  color: ${colors.grayText};
  width: 1120px;

  .custom-select-wrapper {
    width: 204px;
  }
  .back-button {
    width: 44px;
    height: 44px;
    padding: 10px;
    cursor: pointer;
  }
  .back-icon {
    width: 14px;
    height: 8px;
    transform: rotateZ(90deg);
  }

  .back-to-tranfer {
    margin-bottom: 31px;
    display: inline-flex;
  }
  .pagination-inline {
    display: inline-flex;
  }
  .next-btn {
    transform: rotateY(180deg);
  }

  .selector-group {
    display: flex;
  }

  ${media.md`
    width: 100%;

    .control-group {
      flex-direction: column;
      align-items: center;
    }
    .selector-group {
      margin-top: 20px;
      flex-direction: column;
      align-items: center;

      .exchange-icon {
        width: 15px;
        transform: rotate(90deg);
        margin: 20px 0;
      }

      div.select-asset {
        height: 24px;
      }
    }
  `};
`;

export const TransferHistory = ({ setIsOpenHistory }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const onClickDetail = (detail) => {
    setSelectedRow(detail);
    setShowDetails(true);
  };
  function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return (
        <div className="pagination-inline">
          <a className="ant-pagination-item">
            <img src={UnionSrc} />
          </a>
          <a className="ant-pagination-item">
            <img src={PrevIconSrc} />
          </a>
        </div>
      );
    }
    if (type === 'next') {
      return (
        <div className="pagination-inline">
          <a className="ant-pagination-item">
            <img className="next-btn" src={PrevIconSrc} />
          </a>
          <a className="ant-pagination-item">
            <img className="next-btn" src={UnionSrc} />
          </a>
        </div>
      );
    }
    return originalElement;
  }
  return (
    <TransferHistoryStyled>
      <Row>
        <div className="back-to-tranfer">
          <div className="back-button" onClick={() => setIsOpenHistory(false)}>
            <img className="back-icon" src={BackIconSrc} />
          </div>
          <Header className="medium bold">Transfer history</Header>
        </div>
      </Row>
      <Row className="control-group">
        <Text className="medium">Viewing transfer history for</Text>
        <div className="selector-group">
          <SelectAsset className="select-asset" />
          <img className="exchange-icon" src={VectorSrc} />
          <SelectAsset className="select-asset" />
        </div>
      </Row>
      <TableStyled
        columns={columns}
        dataSource={dataSource}
        onRow={(r) => ({
          onClick: () => onClickDetail(r),
        })}
        pagination={{
          position: ['bottomCenter'],
          itemRender: itemRender,
        }}
      />
      {showDetails && (
        <HistoryDetails
          details={selectedRow}
          onClose={() => setShowDetails(false)}
        ></HistoryDetails>
      )}
    </TransferHistoryStyled>
  );
};
