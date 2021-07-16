import { useState } from 'react';
import styled from 'styled-components';
import { Row } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useDispatch } from 'hooks/useRematch';

import { getTransferHistory } from 'services/btpServices';

import { Table } from '../../components/Table';
import { Tag } from '../../components/Tag';
import { SelectAsset } from '../../components/Select';
import { HistoryDetails } from './HistoryDetails';
import { BackButton } from '../../components/Button/BackButton';

import { colors } from '../../components/Styles/Colors';
import { media } from '../../components/Styles/Media';
import { Text } from '../../components/Typography';

import VectorSrc from 'assets/images/vector.svg';

const TableStyled = styled(Table)`
  margin-top: 34px;
  overflow-x: auto;

  .select-asset-container {
    margin-bottom: 34px;
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
    dataIndex: 'txHash',
    width: '480px',
  },
  {
    title: 'Time',
    dataIndex: 'blockTime',
    render: (blockTime) => dayjs(blockTime / 1000).fromNow(),
    width: '180px',
  },
  {
    title: 'Amount',
    dataIndex: 'value',
    render: (text, dataSource) => text + ' ' + dataSource.tokenName?.toUpperCase(),
    width: '300px',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (text) => {
      let status = 'Success';
      let color = '#5EF38C';
      switch (text) {
        case 0:
          color = '#FFBA49';
          status = 'Pending';
          break;
        case -1:
          color = '#F05365';
          status = 'Failed';
          break;
      }
      return <Tag color={color}>{status}</Tag>;
    },
    width: '160px',
  },
];

const TransferHistoryStyled = styled.div`
  padding-top: 36px;
  margin-left: auto;
  margin-right: auto;
  color: ${colors.grayText};
  width: 1120px;
  max-width: 100%;

  .control-group {
    align-items: center;
    margin-top: 31px;

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

const TransferHistory = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [historySource, setHistorySource] = useState([]);
  const [pagination, setPagination] = useState({ totalItem: 0, limit: 20 }); // BE hard-coded 20 items/page
  const [isFetching, setIsFetching] = useState(true);
  const { handleError } = useDispatch(({ modal: { handleError } }) => ({
    handleError,
  }));

  const fetchDataHandler = async (page) => {
    try {
      const transferData = (await getTransferHistory(page - 1)) || {};
      const dataSource = transferData?.content?.map((history, index) => {
        return {
          ...history,
          key: index,
        };
      });
      setHistorySource(dataSource);
      setPagination((pagination) => ({ ...pagination, totalItem: transferData.total || 0 }));
      setIsFetching(false);
    } catch (error) {
      handleError(error);
    }
  };

  const onClickDetail = (detail) => {
    setSelectedRow(detail);
    setShowDetails(true);
  };
  return (
    <TransferHistoryStyled>
      <Row>
        <BackButton>Transfer history</BackButton>
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
        dataSource={historySource}
        onRow={(r) => ({
          onClick: () => onClickDetail(r),
        })}
        pagination={pagination}
        loading={isFetching}
        getItemsHandler={(page) => () => fetchDataHandler(page)}
      />
      {showDetails && (
        <HistoryDetails id={selectedRow.id} onClose={() => setShowDetails(false)}></HistoryDetails>
      )}
    </TransferHistoryStyled>
  );
};

export default TransferHistory;
