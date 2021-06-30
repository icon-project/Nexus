import { useEffect } from 'react';
import { useDispatch, useSelect } from 'hooks/useRematch';
import styled from 'styled-components/macro';

import { ChartArea } from './ChartArea';
import { StatisticArea } from './StatisticArea';
import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 0;

  ${media.xl`
    padding: 24px 12px;
  `}
`;

const Overview = () => {
  const {
    app: { content = {} },
    networks,
  } = useSelect(({ app, network: { selectNetwotks } }) => ({
    app: app.selectAppInfo,
    networks: selectNetwotks,
  }));

  const { getAppInfo, getNetworks } = useDispatch(
    ({ app: { getAppInfo }, network: { getNetworks } }) => ({
      getAppInfo,
      getNetworks,
    }),
  );

  useEffect(() => {
    getAppInfo();
    getNetworks();
  }, [getAppInfo, getNetworks]);

  return (
    <Wrapper>
      <ChartArea volume={content.volume || 0} />
      <StatisticArea data={content} networks={networks} />
    </Wrapper>
  );
};

export default Overview;
