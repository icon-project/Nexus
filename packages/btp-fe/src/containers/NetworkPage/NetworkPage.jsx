import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row } from 'antd';

import { Table } from 'components/Table';
import { Header } from 'components/Typography';
import { Modal } from 'components/NotificationModal';
import { NetwotkDetails } from './NetwotkDetails';

import { colors } from 'components/Styles/Colors';
import { smallText } from 'components/Typography/Text';
import { media } from 'components/Styles/Media';

import { useDispatch, useSelect } from 'hooks/useRematch';

const Network = ({ iconUrl, name, url }) => {
  return (
    <Row align="middle">
      <img className="network-icon" src={iconUrl} />
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
  },
  {
    title: 'Network',
    dataIndex: 'name',
    render: (text, record) => (
      <Network
        iconUrl={process.env.REACT_APP_BTP_ENDPOINT + record.pathLogo.substring(1)}
        name={text}
        url={record.url}
      ></Network>
    ),
  },
  {
    title: 'Volume (24hr)',
    dataIndex: 'usd24h',
  },
  {
    title: 'Volume (All time)',
    dataIndex: 'usdAllTime',
  },
  {
    title: 'Mint fee',
    dataIndex: 'mintFee',
  },
  {
    title: 'Burn fee',
    dataIndex: 'burnFee',
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
  .heading {
    padding: 48px 0 50px 0;
    ${media.md`
      padding: 20px 0 20px 20px;
    `}
  }
  .network-icon {
    margin-right: 12px;
    width: 20px;
    height: 20px;
    image-rendering: -moz-crisp-edges; /* Firefox */
    image-rendering: -o-crisp-edges; /* Opera */
    image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
  }
  .url {
    ${smallText}
    color: ${colors.tertiaryBase};
  }
  .network-name {
    margin-bottom: 8px;
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
      <div className="content">
        <Header className="medium bold heading">Networks</Header>
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
