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

import { toSeparatedNumberString, hashShortener } from 'utils/app';
import { serverEndpoint } from 'connectors/constants';
import { chainList, getTokenList } from 'connectors/chainConfigs';
import { txStatus } from 'utils/constants';

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
    render: (txHash) => hashShortener(txHash),
    width: '180px',
  },
  {
    title: 'Source',
    dataIndex: 'networkNameSrc',
    width: '200px',
  },
  {
    title: 'Destination',
    dataIndex: 'networkNameDst',
    width: '200px',
  },
  {
    title: 'Time',
    dataIndex: 'blockTime',
    render: (blockTime) => dayjs(blockTime).fromNow(),
    width: '193px',
  },
  {
    title: 'Amount',
    dataIndex: 'value',
    render: (text, dataSource) => text + ' ' + dataSource.tokenName?.toUpperCase(),
    width: '200px',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (text) => {
      let status = 'Success';
      let color = '#5EF38C';
      switch (text) {
        case txStatus.PENDING:
          color = '#FFBA49';
          status = 'Pending';
          break;
        case txStatus.FAILED:
          color = '#F05365';
          status = 'Failed';
          break;
      }
      return <Tag color={color}>{status}</Tag>;
    },
    width: '147px',
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
        margin: 40px 32px 0 32px;
        width: 18.33px;
      }

      .select-asset {
        margin-right: 128px;

        > div:last-child {
          margin-top: 20px;
        }
      }

      .select-network {
        display: flex;
        align-items: flex-start;
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
    }

    .selector-group {
      margin-top: 20px;
      flex-direction: column;
      align-items: center;
      display: block !important;


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

      button {
          width: 100%;
          margin-bottom: 10px;
        }

      .select-asset {
        width: 100%;

        > div:last-child {
          margin-top: 0 !important;
        }
      }

      .select-network {
        flex-direction: column;
        width: 100%;
        margin-bottom: 30px;

        > div {
          width: 100%;
        }

        > .exchange-icon {
          display: none;
        }
      }
    }
  `};
`;

let intervalFetch = null;

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
    status: '',
  });

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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (intervalFetch) clearInterval(intervalFetch);

    intervalFetch = setInterval(() => {
      if (sessionStorage.getItem('page') == 1) {
        fetchDataHandler({ ...filters, page: 1 });
      }
    }, 4000);

    return () => {
      if (intervalFetch) clearInterval(intervalFetch);
    };
  }, [JSON.stringify(filters)]);

  const assets = [
    {
      value: '',
      label: 'All assets',
      renderLabel: () => <Text className="md">All assets</Text>,
      renderItem: () => <Text className="md">All assets</Text>,
    },
    ...[...getTokenList(), ...chainList].map(({ symbol, COIN_SYMBOL }) => {
      const value = COIN_SYMBOL || symbol;

      return {
        label: value,
        value,
        renderLabel: () => <TextWithIcon icon={value}>{value}</TextWithIcon>,
        renderItem: () => <TextWithIcon icon={value}>{value}</TextWithIcon>,
      };
    }),
  ];

  const transactionStatus = [
    {
      value: '',
      label: 'All status',
    },
    ...Object.keys(txStatus).map((key) => ({
      value: txStatus[key],
      label: key[0] + key.slice(1, key.length).toLocaleLowerCase(), // capitalizeFirstLetter
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
    const iconURL = serverEndpoint + network.pathLogo.substring(1);
    networkOptions.push({
      value: network.id,
      label: network.name,
      renderLabel: () => <TextWithIcon iconURL={iconURL}>{network.name}</TextWithIcon>,
      renderItem: () => <TextWithIcon iconURL={iconURL}>{network.name}</TextWithIcon>,
    });
  });

  const fetchDataHandler = async ({ page, assetName, from, to, status }) => {
    try {
      const transferData =
        (await getTransferHistory(page - 1, pagination.limit, assetName, from, to, status)) || {};
      const dataSource = transferData?.content?.map((history, index) => {
        return {
          ...history,
          key: index,
        };
      });
      setHistorySource(dataSource);
      setPagination((pagination) => ({ ...pagination, totalItem: transferData.total || 0 }));
      sessionStorage.setItem('page', page);
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
              maxHeight="180px"
            />
            <SelectWithBorder
              onChange={(e) => onSelectChange(e, 'status')}
              label="Status"
              options={transactionStatus}
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
        bodyText="md"
        columns={columns}
        dataSource={historySource}
        onRow={(r) => ({
          onClick: () => onClickDetail(r),
        })}
        pagination={pagination}
        loading={isFetching}
        getItemsHandler={(page) => () => fetchDataHandler({ ...filters, page })}
        filterParams={JSON.stringify(filters)}
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
