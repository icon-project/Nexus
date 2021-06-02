import { useState } from 'react';
import styled from 'styled-components/macro';
import { SubTitle, Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

import arrowIcon from '../../assets/images/blue-arrow-icon.svg';

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

    .filter-control {
      color: ${colors.tertiaryBase};
      display: flex;
      align-items: center;

      &:after {
        content: '';
        display: inline-block;
        width: 9.33px;
        height: 5.33px;
        margin-left: 7.67px;
        background: transparent center / contain no-repeat url('${arrowIcon}');
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
`;

const tabs = {
  history: 'history',
  asset: 'asset',
};

const contents = {
  [tabs.history]: 'Area Chart',
  [tabs.asset]: 'Pie Chart',
};

export const ChartBox = () => {
  const [currentTab, setCurrentTab] = useState(tabs.history);

  const isCurrentTab = (tab) => (currentTab === tabs[tab] ? 'bold active' : 'regular');

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
        <Text className="x-small filter-control">Binanace Smart Chain</Text>
      </div>

      <div className="tab-content">{contents[currentTab]}</div>
    </Wrapper>
  );
};
