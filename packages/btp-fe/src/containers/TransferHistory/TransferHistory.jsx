import { useState, useEffect } from 'react';
import { useDispatch, useSelect } from 'hooks/useRematch';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { getTransferHistory } from 'services/btpServices';

import { Helmet } from 'components/Helmet';
import { Table } from 'components/Table';
import { Tag } from 'components/Tag';
import { SelectWithBorder } from 'components/Select';
import { HistoryDetails } from './HistoryDetails';
import { BackButton } from 'components/Button/BackButton';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { TextWithIcon } from 'components/TextWithIcon';
import { Text } from 'components/Typography';

import { tokenOptionList } from 'utils/constants';
import { toSeparatedNumberString } from 'utils/app';

import VectorSrc from 'assets/images/vector.svg';

const TableStyled = styled(Table)`
  margin-top: 18px;
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
    render: (blockTime) => dayjs(blockTime).fromNow(),
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
  padding: 36px 0 60px;
  margin: 0 auto;
  color: ${colors.grayText};
  width: 1120px;
  max-width: 100%;

  .control-group {
    align-items: center;
    margin: 60px 0 42px;

    .selector-group {
      display: flex;

      .exchange-icon {
        margin: 22px 32px 0 32px;
      }

      .select-asset {
        margin-right: 128px;
      }

      .select-network {
        display: flex;
      }
    }
  }

  ${media.xl`
    width: 100%;

    .select-asset {
        margin-right: auto !important;
        margin-bottom: 8px;
    }

    .control-group {
      flex-direction: column;
      align-items: start;
      margin-left: 24px;
    }

    .selector-group {
      margin-top: 20px;
      flex-direction: column;
      align-items: center;

      .exchange-icon {
        width: 15px;
        margin: 22px 18px 0 18px !important;
        margin: 20px 0;
      }
    }
  `};

  ${media.md`
    > .control-group {
      align-items: center;
      margin: 20px 0 0;

      .select-asset {
        width: 100%;
        margin: 0 0 30px !important;
      }

      .select-network {
        flex-direction: column;
        width: 100%;

        > .exchange-icon {
          display: none;
        }

        button {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
    
  
  `};
`;

const TransferHistory = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [historySource, setHistorySource] = useState([]);
  const [pagination, setPagination] = useState({ totalItem: 0, limit: 20 });
  const [isFetching, setIsFetching] = useState(true);

  const [filters, setFilters] = useState({
    assetName: '',
    from: '',
    to: '',
  });
  const { from, to, assetName } = filters;

  const { handleError, getNetworks } = useDispatch(
    ({ modal: { handleError }, network: { getNetworks } }) => ({
      handleError,
      getNetworks,
    }),
  );
  const { networks } = useSelect(({ network: { selectNetwotks } }) => ({
    networks: selectNetwotks,
  }));

  useEffect(() => {
    getNetworks({ cache: true });
  }, [getNetworks]);

  const assets = [
    {
      value: '',
      label: 'All assets',
      renderLabel: () => <Text className="md">All assets</Text>,
      renderItem: () => <Text className="md">All assets</Text>,
    },
    ...tokenOptionList.map(({ symbol }) => ({
      value: symbol,
      label: symbol,
      renderLabel: () => <TextWithIcon icon={symbol}>{symbol}</TextWithIcon>,
      renderItem: () => <TextWithIcon icon={symbol}>{symbol}</TextWithIcon>,
    })),
  ];

  let networkOptions = [
    {
      value: '',
      label: 'All networks',
      renderLabel: () => <Text className="md">All networks</Text>,
      renderItem: () => <Text className="md">All networks</Text>,
    },
  ];
  networks.forEach((network) => {
    networkOptions.push({
      value: network.id,
      label: network.name,
      renderLabel: () => (
        <TextWithIcon iconURL={process.env.REACT_APP_BTP_ENDPOINT + network.pathLogo.substring(1)}>
          {network.name}
        </TextWithIcon>
      ),
      renderItem: () => (
        <TextWithIcon iconURL={process.env.REACT_APP_BTP_ENDPOINT + network.pathLogo.substring(1)}>
          {network.name}
        </TextWithIcon>
      ),
    });
  });

  const fetchDataHandler = async ({ page, assetName, from, to }) => {
    try {
      const transferData =
        (await getTransferHistory(page - 1, pagination.limit, assetName, from, to)) || {};
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

  const onSelectChange = (event, selectorName) => {
    const { value } = event.target;

    if (value !== filters[selectorName]) {
      setFilters({ ...filters, [selectorName]: value });
      fetchDataHandler({ page: 1, assetName, from, to, [selectorName]: value });
    }
  };
  return (
    <TransferHistoryStyled>
      <Helmet title="Transfer history" />

      <BackButton url="/transfer">Transfer history</BackButton>
      <div className="control-group">
        <div className="selector-group">
          <div className="select-asset">
            <SelectWithBorder
              onChange={(e) => onSelectChange(e, 'assetName')}
              label="Assets type"
              options={assets}
            />
          </div>
          <div className="select-network">
            <SelectWithBorder
              onChange={(e) => onSelectChange(e, 'from')}
              label="Sending from"
              width="326px"
              options={networkOptions}
            />
            <img className="exchange-icon" src={VectorSrc} />
            <SelectWithBorder
              onChange={(e) => onSelectChange(e, 'to')}
              label="To"
              width="326px"
              options={networkOptions}
            />
          </div>
        </div>
      </div>

      <Text className="md">
        {toSeparatedNumberString(pagination.totalItem)} transaction
        {pagination.totalItem !== 1 ? 's' : ''} found
      </Text>

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
        getItemsHandler={(page) => () => fetchDataHandler({ page, assetName, from, to })}
      />
      {showDetails && (
        <HistoryDetails
          txHash={selectedRow.txHash}
          onClose={() => setShowDetails(false)}
        ></HistoryDetails>
      )}
    </TransferHistoryStyled>
  );
};

export default TransferHistory;
