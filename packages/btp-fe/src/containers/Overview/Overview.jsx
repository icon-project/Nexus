import { useEffect, useState } from 'react';
import { useDispatch, useSelect } from 'hooks/useRematch';
import styled from 'styled-components/macro';

import { ChartArea } from './ChartArea';
import { StatisticArea } from './StatisticArea';
import { Loader } from 'components/Loader';
import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 0;

  ${media.xl`
    padding: 24px 12px;
  `}
`;

const LoadingPage = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 24px;
`;

const Overview = () => {
  const [loading, setLoading] = useState(true);
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
    const fetchingData = async () => {
      await getAppInfo();
      await getNetworks();
      setLoading(false);
    };
    fetchingData();
  }, [getAppInfo, getNetworks]);

  return (
    <>
      {loading ? (
        <LoadingPage>
          <Loader size="20px" borderSize="3px" />
        </LoadingPage>
      ) : (
        <Wrapper>
          <ChartArea data={content} />
          <StatisticArea data={content} networks={networks} />
        </Wrapper>
      )}
    </>
  );
};

export default Overview;
