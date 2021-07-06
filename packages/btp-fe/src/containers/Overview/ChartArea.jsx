import { useState } from 'react';
import styled from 'styled-components/macro';
import { useSelect } from 'hooks/useRematch';

import { ChartBox } from './ChartBox';
import { TextWithInfo } from 'components/TextWithInfo';
import { Header } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  .chart {
    width: 48.9%;
    height: 548px;
    padding: 32px;
    background-color: ${colors.brandSecondaryBase};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    ${media.sm`
      height: 595px;
    `}
  }
  ${media.xl`
    .chart {
      height: fit-content;
    }
  `};

  ${media.xl`
    flex-direction: column;

    .chart {
      width: 100%;

      &:first-child{
        margin-bottom: 24px;
      }

      h3 {
        word-break: break-all;
      }
    }
  `}
`;

export const ChartArea = ({ volume = 0 }) => {
  const { networks } = useSelect(({ app: { selectConnectedNetworks } }) => ({
    networks: selectConnectedNetworks,
  }));
  const connectedNetworks = networks ? Object.values(networks) : {};
  const [valueMint, setValueMint] = useState(null);

  return (
    <Wrapper>
      <div className="chart">
        <TextWithInfo tooltip="Total amount of volume transacted via BTP in $">VOLUME</TextWithInfo>
        <Header className="medium bold">
          ${volume.toLocaleString()} <UpDownPercent percent="9.55%" />
        </Header>
        <ChartBox chartId="volume" networks={networks} />
      </div>
      <div className="chart">
        <TextWithInfo
          tooltip="Total value (TVL) of all digital assets currently minted on each blockchain by BTP in $"
          width={300}
        >
          VALUE MINT
        </TextWithInfo>
        <Header className="medium bold">
          $
          {(valueMint !== null
            ? valueMint
            : connectedNetworks[0]?.mintedVolume || 0
          ).toLocaleString()}{' '}
          <UpDownPercent up percent="9.55%" />
        </Header>
        <ChartBox chartId="mint" networks={networks} setValueMint={setValueMint} />
      </div>
    </Wrapper>
  );
};
