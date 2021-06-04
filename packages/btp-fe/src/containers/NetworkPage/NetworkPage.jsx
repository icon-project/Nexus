import { useState } from 'react';
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

import binanceIcon from 'assets/images/binance.svg';
import edgewareIcon from 'assets/images/edgeware.svg';
import iconexIcon from 'assets/images/icon-ex.svg';

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
    dataIndex: 'key',
  },
  {
    title: 'Network',
    dataIndex: 'network',
    render: (text, record) => (
      <Network iconUrl={record.iconUrl} name={text} url={record.url}></Network>
    ),
  },
  {
    title: 'Volume (24hr)',
    dataIndex: 'vol24hr',
  },
  {
    title: 'Volume (All time)',
    dataIndex: 'volalltime',
  },
  {
    title: 'Mint fee',
    dataIndex: 'mint',
  },
  {
    title: 'Burn fee',
    dataIndex: 'burn',
  },
];
const dataSource = [
  {
    key: 1,
    network: 'Binance Smart Chain',
    url: 'www.binance.org/en',
    iconUrl: binanceIcon,
    vol24hr: '$8,156,717.24',
    volalltime: '$1,866,877,934.27',
    mint: '0.25%',
    burn: '0.1%',
  },
  {
    key: 2,
    network: 'Edgeware',
    url: 'www.edgewa.re/',
    iconUrl: edgewareIcon,
    vol24hr: '$8,156,717.24',
    volalltime: '$1,866,877,934.27',
    mint: '0.25%',
    burn: '0.1%',
  },
  {
    key: 3,
    network: 'ICON blockchain',
    url: 'iconrepublic.org/',
    iconUrl: iconexIcon,
    vol24hr: '$8,156,717.24',
    volalltime: '$1,866,877,934.27',
    mint: '0.25%',
    burn: '0.1%',
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
    margin-bottom: 18px;
  }
`;

function NetworkPage() {
  const [isModalOpened, setModalOpen] = useState(false);

  return (
    <NetworkStyled>
      <div className="content">
        <Header className="medium bold heading">Networks</Header>
        <div className="filter-by">
          <SortSelect />
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
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
