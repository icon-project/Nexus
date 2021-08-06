import { useEffect } from 'react';
import { useDispatch, useSelect } from 'hooks/useRematch';
import styled from 'styled-components/macro';

import { ValuesArea } from './ValuesArea';
import { StatisticArea } from './StatisticArea';
import { Helmet } from 'components/Helmet';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 0;
`;

const Overview = () => {
  const {
    app: { content = {} },
    networks,
  } = useSelect(({ app: { selectAppInfo }, network: { selectNetwotks } }) => ({
    app: selectAppInfo,
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
    getNetworks({ cache: true });
  }, [getAppInfo, getNetworks]);

  return (
    <Wrapper>
      <Helmet title="Overview" />

      <ValuesArea data={content} />
      <StatisticArea data={content} networks={networks} />
    </Wrapper>
  );
};

export default Overview;
