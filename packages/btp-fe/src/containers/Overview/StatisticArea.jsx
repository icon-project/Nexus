import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .transaction {
    width: 23.57%;
    background-color: tomato;
    height: 324px;
  }

  .fee {
    width: 48.57%;
    background-color: tomato;
    height: 324px;
  }

  .networks {
    width: 23.57%;
    background-color: tomato;
    height: 324px;
  }
`;

export const StatisticArea = () => {
  return (
    <Wrapper>
      <div className="transaction"></div>
      <div className="fee"></div>
      <div className="networks"></div>
    </Wrapper>
  );
};
