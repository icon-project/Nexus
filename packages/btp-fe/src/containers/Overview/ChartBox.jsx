import { useState } from 'react';
import styled from 'styled-components/macro';
import { SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { AreaChart } from 'components/AreaChart';
import { DonutChart } from 'components/DonutChart';

import { SelectNetwork } from 'components/Select/SelectNetwork';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 33px;
  display: flex;
  flex-direction: column;
  flex: 1;

  .tab-control {
    display: flex;
    justify-content: space-between;
    margin-bottom: 29px;

    .tab-group {
      display: flex;

      h3 {
        padding-bottom: 10px;
        border-bottom: solid 2px transparent;
        cursor: pointer;
        color: ${colors.grayScaleSubText};

        &:first-child {
          margin-right: 16px;
        }

        &.active {
          border-bottom-color: ${colors.primaryBrand};
          color: ${colors.grayText};
        }
      }
    }
  }

  .tab-content {
    width: 100%;
    flex: 1;
    display: grid;
    place-items: center;
    color: white;
    font-size: 30px;
  }

  ${media.xl`
    .tab-control {
      flex-direction: column;

      .filter-control {
        margin-top: 24px;
        align-self: flex-end;
      }
    }
  `}
`;

const tabs = {
  history: 'history',
  asset: 'asset',
};

export const ChartBox = ({ chartId, networks, setValueMint }) => {
  const [currentTab, setCurrentTab] = useState(tabs.history);
  const connectedNetworks = Object.values(networks);

  const isCurrentTab = (tab) => (currentTab === tabs[tab] ? 'bold active' : 'regular');
  const onChange = (event) => {
    const { value } = event.target;
    if (value) {
      if (setValueMint) setValueMint(networks[event.target.value].mintedVolume);
    }
  };

  return (
    <Wrapper>
      <div className="tab-control">
        <div className="tab-group">
          <SubTitle
            className={`small ${isCurrentTab(tabs.history)}`}
            onClick={() => setCurrentTab(tabs.history)}
          >
            History
          </SubTitle>
          <SubTitle
            className={`small ${isCurrentTab(tabs.asset)}`}
            onClick={() => setCurrentTab(tabs.asset)}
          >
            Digital Asset
          </SubTitle>
        </div>
        <SelectNetwork options={connectedNetworks} onChange={onChange} />
      </div>

      <div className="tab-content">
        {currentTab === tabs.history ? (
          <AreaChart chartId={chartId} />
        ) : (
          <DonutChart chartId={chartId} />
        )}
      </div>
    </Wrapper>
  );
};
