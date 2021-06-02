import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  .chart {
    width: 48.9%;
    height: 548px;
    background-color: thistle;
  }
`;

export const ChartArea = () => {
  return (
    <Wrapper>
      <div className="chart"></div>
      <div className="chart"></div>
    </Wrapper>
  );
};
