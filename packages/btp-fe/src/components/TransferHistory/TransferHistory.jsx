import { useState } from 'react';
import styled from 'styled-components';
import { Row } from 'antd';

import { Table } from '../Table';
import { Tag } from '../Tag';
import { SelectAsset } from '../Select';
import { HistoryDetails } from './HistoryDetails';

import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';
import { Header, Text } from '../Typography';

import VectorSrc from 'assets/images/vector.svg';
import BackIconSrc from 'assets/images/arrow-icon.svg';

const TableStyled = styled(Table)`
  margin-top: 34px;
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
  ${media.md`
    .ant-table-content {
      overflow-x: auto;
    }
  `};
`;

/* eslint-disable react/display-name */
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

  .control-group {
    align-items: center;

    p.medium {
      margin-right: 8px;
    }

    .selector-group {
      display: flex;

      .exchange-icon {
        margin: 0 32.83px 0 35.83px;
      }
    }
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
        headerColor={colors.grayAccent}
        backgroundColor={colors.darkBG}
        bodyText={'md'}
        columns={columns}
        dataSource={dataSource}
        onRow={(r) => ({
          onClick: () => onClickDetail(r),
        })}
        pagination
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
