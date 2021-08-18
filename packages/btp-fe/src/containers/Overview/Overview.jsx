import { useEffect, useState } from 'react';
import { useDispatch, useSelect } from 'hooks/useRematch';
import styled from 'styled-components/macro';

import { ValuesArea } from './ValuesArea';
import { StatisticArea } from './StatisticArea';
import { Helmet } from 'components/Helmet';
import { skeleton } from './skeletonStyle';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 0;

  &.loading {
    ${skeleton};
  }
`;

const Overview = () => {
  const [isFetching, setIsFeching] = useState(true);
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
    const fetchData = async () => {
      await getAppInfo();
      await getNetworks({ cache: true });
      setIsFeching(true);
    };
    fetchData();
  }, [getAppInfo, getNetworks]);

  return (
    <Wrapper className={isFetching ? 'loading' : ''}>
      <Helmet title="Overview" />
      <ValuesArea isFetching={isFetching} data={content} />
      <StatisticArea isFetching={isFetching} data={content} networks={networks} />
    </Wrapper>
  );
};

export default Overview;
