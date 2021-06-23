import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row } from 'antd';

import { Table } from 'components/Table';
import { Header } from 'components/Typography';
import { Modal } from 'components/NotificationModal';
import { NetwotkDetails } from './NetwotkDetails';

import { colors } from 'components/Styles/Colors';
import { smallText } from 'components/Typography/Text';
import { SortSelect } from 'components/Select';
import { media } from 'components/Styles/Media';

import { useDispatch, useSelect } from 'hooks/useRematch';

import binanceIcon from 'assets/images/binance.svg';

const Network = ({ iconUrl, name, url }) => {
  return (
    <Row>
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
      <Network iconUrl={record.iconUrl || binanceIcon} name={text} url={record.url}></Network>
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
  }
  .url {
    ${smallText}
    color: ${colors.tertiaryBase};
  }
  .network-name {
    margin-bottom: 8px;
  }
  .filter-by {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }
`;

function NetworkPage() {
  const [isModalOpened, setModalOpen] = useState(false);

  const { networks } = useSelect(({ network: { selectNetwotks } }) => ({
    networks: selectNetwotks,
  }));

  const { getNetworks } = useDispatch(({ network: { getNetworks } }) => ({
    getNetworks,
  }));

  useEffect(() => {
    getNetworks();
  }, [getNetworks]);

  return (
    <NetworkStyled>
      <div className="content">
        <Header className="medium bold heading">Networks</Header>
        <div className="filter-by">
          <SortSelect />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={networks}
          pagination={false}
          headerColor={colors.grayAccent}
          backgroundColor={colors.darkBG}
          bodyText={'md'}
          onRow={(r) => ({
            onClick: () => setModalOpen(r),
          })}
        />
      </div>
      {isModalOpened && (
        <Modal display={isModalOpened} width="736px" title="Curve" setDisplay={setModalOpen}>
          <NetwotkDetails />
        </Modal>
      )}
    </NetworkStyled>
  );
}

export default NetworkPage;
