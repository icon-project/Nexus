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
  const [loading, setLoading] = useState(true);
  const {
    app: { content = {} },
  } = useSelect(({ app }) => ({
    app: app.selectAppInfo,
  }));

  const { getAppInfo } = useDispatch(({ app: { getAppInfo } }) => ({
    getAppInfo,
  }));

  useEffect(() => {
    const handleGetAppInfo = async () => {
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
          <ChartArea volume={content.volume || 0} />
          <StatisticArea data={content} />
        </>
      )}
    </Wrapper>
  );
};

export default Overview;
