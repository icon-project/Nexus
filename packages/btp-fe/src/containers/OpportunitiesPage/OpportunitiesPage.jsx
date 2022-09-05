import { Button } from 'components/Button';
import { colors, media } from 'components/Styles';
import { Table } from 'components/Table';
import { useState } from 'react';
import styled from 'styled-components/macro';
import { highlightApyData, opportunitiesAssets, opportunitiesPools, opportunityType } from './data';
import greaterThanIcon from 'assets/images/greater-than.svg';
import IconExIcon from 'assets/images/icon-ex.svg';
import { Modal } from 'components/NotificationModal';
import { OpportunityDetail } from './OpportunityDetail';
import { OpportunitySwitch } from './OpportunitySwitch';

const OpportunitiesStyled = styled.div`
  max-width: 1120px;
  margin: auto;
  display: flex;
  justify-content: center;

  .contents {
    width: 1120px;
    ${media.md`
          width: ${`${window.screen.width}px`};
        `}
    .table {
      margin-top: 16px;
      Table {
        width: 100%;
      }
    }
  }

  & .apy {
    background: #000000;
    border: 1px solid #353242;
    border-radius: 5px;
    margin: auto;
    margin-top: 16px;
    padding: 20px;

    > h4 {
      font-weight: 700;
      font-size: 18px;
      line-height: 20px;
      color: white;
      text-align: left;
    }
    & .apy-list {
      display: flex;
      gap: 22px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 20px;
    }
    & .each-apy {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 18px;
      width: 342px;
      color: white;
      border: 1px solid #353242;
      border-radius: 5px;
      & .left {
        display: flex;
        gap: 16px;
        align-items: center;
        & .icon-wrapper {
          position: relative;
          .main-image {
            width: 64px;
          }
          .highlight-float-image {
            position: absolute;
            bottom: 0px;
            right: 0px;
            width: 24px;
            height: 24px;
            border: 2px solid #ffffff;
            border-radius: 65px;
          }
        }
        & .info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          & > h3 {
            font-weight: 700;
            font-size: 24px;
            line-height: 20px;
          }
          & > h4 {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
    & .highlighted-apy {
      background: #353242;
    }
  }
`;

const OpportunitiesPage = () => {
  const [selectedApy, setSelectedApy] = useState(0);
  const [selectedOpportunityType, setSelectedOpportunityType] = useState(opportunityType.asset);
  const [exploreData, setExploreData] = useState(null);

  const baseColumns = [
    {
      title: 'Chain',
      dataIndex: 'chain',
      align: 'left',
    },
    {
      title: 'Protocol',
      dataIndex: 'protocol',
      align: 'left',
    },
    {
      title: 'APY',
      dataIndex: 'apy',
      align: 'left',
    },
    {
      title: 'Total Assets',
      dataIndex: 'totalAssets',
      align: 'left',
    },
    {
      title: '',
      dataIndex: '',
      align: '',
    },
    {
      title: '',
      // eslint-disable-next-line react/display-name
      render: (_text, record) => (
        <Button
          disabled={!record.explored}
          borderRadius={64}
          style={{ padding: '5px 17px' }}
          disabledTextColor={'#83DEFD'}
          disabledBackgroundColor={'#312F39'}
          onClick={() => setExploreData(record)}
        >
          Explore
        </Button>
      ),
    },
  ];

  const assetColumns = [
    {
      title: 'Asset',
      dataIndex: 'title',
      align: 'left',
      // eslint-disable-next-line react/display-name
      render: (text, { image }) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={image} alt={text} style={{ width: '36px' }} />
          <h4>{text}</h4>
        </div>
      ),
    },
    ...baseColumns,
  ];

  const poolColumns = [
    {
      title: 'Pool',
      dataIndex: 'title',
      align: 'left',
      // eslint-disable-next-line react/display-name
      render: (text, { image }) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={image} alt={text} style={{ width: '36px' }} />
          <h4>{text}</h4>
        </div>
      ),
    },
    ...baseColumns,
  ];
  const handleChangeOpportunityType = () => {
    if (selectedOpportunityType === opportunityType.asset) {
      setSelectedOpportunityType(opportunityType.pool);
      return;
    }
    if (selectedOpportunityType === opportunityType.pool) {
      setSelectedOpportunityType(opportunityType.asset);
    }
  };

  return (
    <OpportunitiesStyled>
      <div className="contents">
        <div className="apy">
          <h4>Highest APY</h4>
          <div className="apy-list">
            {highlightApyData.map(({ apy, title, image }, idx) => (
              <div
                key={`apy_${idx}`}
                onClick={() => setSelectedApy(idx)}
                className={`each-apy  ${selectedApy === idx ? 'highlighted-apy' : ''}`}
              >
                <div className="left">
                  <div className="icon-wrapper">
                    <img src={image} alt={title} />
                    <img src={IconExIcon} alt="icon" className="highlight-float-image" />
                  </div>
                  <div className="info">
                    <h4>{title}</h4>
                    <h3>{apy}</h3>
                  </div>
                </div>
                <div className="right">
                  <img src={greaterThanIcon} alt="Greater Than" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="switch-wrapper">
          <OpportunitySwitch
            handleChangeOpportunityType={handleChangeOpportunityType}
            selectedOpportunityType={selectedOpportunityType}
          />
        </div>
        <div className="table">
          <Table
            rowKey="id"
            columns={selectedOpportunityType === opportunityType.asset ? assetColumns : poolColumns}
            dataSource={
              selectedOpportunityType === opportunityType.asset
                ? opportunitiesAssets
                : opportunitiesPools
            }
            headerColor={colors.grayAccent}
            backgroundColor={colors.darkBG}
            bodyText={'md'}
            pagination={{ limit: 2, totalItem: 10 }}
          />
        </div>
      </div>
      <Modal
        display={!!exploreData}
        setDisplay={() => setExploreData(null)}
        contentPadding="20px"
        title={exploreData?.pool || '-'}
        titleStyle={{ textAlign: 'left' }}
      >
        <OpportunityDetail {...exploreData} />
      </Modal>
    </OpportunitiesStyled>
  );
};

export default OpportunitiesPage;
