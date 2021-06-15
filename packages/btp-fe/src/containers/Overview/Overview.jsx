import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const {
    app: { content },
  } = useSelect(({ app }) => ({
    app: app.selectAppInfo,
  }));

  const { getAppInfo } = useDispatch(({ app: { getAppInfo } }) => ({
    getAppInfo,
  }));

  const { fee, totalNetworks, totalTransaction, volume } = content;

  useEffect(() => {
    const handleGetAppInfo = async () => {
      setLoading(true);
      await getAppInfo();
      setLoading(false);
    };
    handleGetAppInfo();
  }, [getAppInfo]);
  return (
    <Wrapper>
      {loading ? (
        <div></div>
      ) : (
        <>
          <ChartArea volume={volume} />
          <StatisticArea
            fee={fee}
            totalNetworks={totalNetworks}
            totalTransaction={totalTransaction}
          />
        </>
      )}
    </Wrapper>
  );
};

export default Overview;
