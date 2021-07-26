import { useState } from 'react';
import styled from 'styled-components/macro';
import { useSelect } from 'hooks/useRematch';

import { TextWithInfo } from 'components/TextWithInfo';
import { Header } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import bgImg from 'assets/images/many-lines.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  > .value {
    width: 48.9%;
    height: 169px;
    padding: 32px;
    background: ${colors.brandSecondaryBase} right / contain no-repeat url('${bgImg}');
    border-radius: 4px;
    display: flex;
    flex-direction: column;

    > p.small {
      margin-top: 12px;
    }
  }

  ${media.xl`
    flex-direction: column;

    > .value {
      width: 100%;
      height: fit-content;

      &:first-child{
        margin-bottom: 24px;
      }

      h3 {
        word-break: break-all;
      }
    }
  `}
`;

export const ValuesArea = ({ data }) => {
  const { volume = 0, last24hChange, mintVolumeLast24hChange } = data;
  const { networks } = useSelect(({ app: { selectConnectedNetworks } }) => ({
    networks: selectConnectedNetworks,
  }));
  const connectedNetworks = networks ? Object.values(networks) : {};
  const [valueMint] = useState(null);

  return (
    <Wrapper>
      <div className="value">
        <TextWithInfo tooltip="Total amount of volume transacted via BTP in $">VOLUME</TextWithInfo>
        <Header className="medium bold">${volume.toLocaleString()}</Header>
        <UpDownPercent percent={last24hChange} />
      </div>
      <div className="value">
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
        </Header>
        <UpDownPercent percent={mintVolumeLast24hChange} />
      </div>
    </Wrapper>
  );
};
