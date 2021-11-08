import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

import { Helmet } from 'components/Helmet';
import { Table } from 'components/Table';
import { Row } from 'components/Layout';
import { Icon } from 'components/Icon';
import { Header } from 'components/Typography';
import { Modal } from 'components/NotificationModal';
import { NetwotkDetails } from './NetwotkDetails';

import { colors } from 'components/Styles/Colors';
import { TextMixin } from 'components/Typography/Text';
import { media } from 'components/Styles/Media';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { toSeparatedNumberString } from 'utils/app';

const Network = ({ iconUrl, name, url }) => {
  return (
    <Row className="middle">
      <Icon className="network-icon" iconURL={iconUrl} size="s" />
      <div>
        <div className="network-name">{name}</div>
        <a href={`https://${url}`} target="_blank" rel="noreferrer" className="url">
          {url}
        </a>
      </div>
    </Row>
  );
};

/* eslint-disable react/display-name */
const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => index + 1,
    width: '64px',
    align: 'center',
  },
  {
    title: 'Network',
    dataIndex: 'name',
    render: (text, record) => (
      <Network
        iconUrl={process.env.REACT_APP_BTP_ENDPOINT + record.pathLogo.substring(1)}
        name={text}
        url={record.url}
      />
    ),
    width: '288px',
  },
  {
    title: 'Volume (24hr)',
    dataIndex: 'usd24h',
    render: (value) => toSeparatedNumberString(value),
    width: '256px',
  },
  {
    title: 'Volume (All time)',
    dataIndex: 'usdAllTime',
    render: (value) => toSeparatedNumberString(value),
    width: '256px',
  },
  {
    title: 'Mint fee',
    dataIndex: 'mintFee',
    render: (value) => toSeparatedNumberString(value),
    width: '128px',
  },
  {
    title: 'Burn fee',
    dataIndex: 'burnFee',
    render: (value) => toSeparatedNumberString(value),
    width: '128px',
  },
];

const NetworkStyled = styled.div`
  max-width: 1120px;
  margin: auto;

  .main {
    display: flex;
    justify-content: center;
    .content {
      width: 1120px;
      ${media.md`
      width: ${`${window.screen.width}px`};
    `}
    }
  }

  .header-text {
    padding: 48px 0 50px 0;
    ${media.md`
      padding: 20px 0 20px 20px;
    `}
  }

  .network-icon {
    margin-right: 12px;
  }

  .url {
    ${TextMixin.sm};
    color: ${colors.tertiaryBase};
  }

  .network-name {
    height: 20px;
    margin-bottom: 8px;
  }

  .ant-table-tbody > tr > td {
    padding: 10px 14px 9px;
  }
`;

function NetworkPage() {
  const [currentNetworkID, setCurrentNetworkID] = useState(null);
  const [loading, setLoading] = useState(true);

  const { networks } = useSelect(({ network: { selectNetwotks } }) => ({
    networks: selectNetwotks,
  }));

  const { getNetworks } = useDispatch(({ network: { getNetworks } }) => ({
    getNetworks,
  }));

  useEffect(() => {
    getNetworks().then(() => {
      setLoading(false);
    });
  }, [getNetworks]);

  return (
    <NetworkStyled>
      <Helmet title="Network" />

      <div className="content">
        <Header className="md bold">Networks</Header>
        <Table
          rowKey="id"
          loading={loading && networks.length === 0}
          columns={columns}
          dataSource={networks}
          pagination={false}
          headerColor={colors.grayAccent}
          backgroundColor={colors.darkBG}
          bodyText={'md'}
          onRow={(r) => ({
            onClick: () => {
              setCurrentNetworkID(r.id);
            },
          })}
        />
      </div>
      {currentNetworkID && (
        <Modal
          display={currentNetworkID}
          width="736px"
          title="Curve"
          setDisplay={setCurrentNetworkID}
        >
          <NetwotkDetails currentNetworkID={currentNetworkID} />
        </Modal>
      )}
    </NetworkStyled>
  );
}

export default NetworkPage;
