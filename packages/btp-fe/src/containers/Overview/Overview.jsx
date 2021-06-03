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
  return (
    <Wrapper>
      <ChartArea />
      <StatisticArea />
    </Wrapper>
  );
};

export default Overview;
