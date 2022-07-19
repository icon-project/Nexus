import { useEffect } from 'react';
import styled from 'styled-components/macro';

import { Header, SubTitle } from 'components/Typography';
import { Icon } from 'components/Icon';

import { useDispatch } from 'hooks/useRematch';

import checkIcon from 'assets/images/green-checked-icon.svg';

const Wrapper = styled.div`
  padding: 80px;
  text-align: center;

  > img {
    margin: 50px 0 20px;
  }
`;

const HanaWalletSimulation = () => {
  const { setE2EState } = useDispatch(({ e2e: { setE2EState } }) => ({
    setE2EState,
  }));

  useEffect(() => {
    setE2EState(['E2ETestMode', true]);
  }, [setE2EState]);

  return (
    <Wrapper>
      <Header className="sm">E2E Test setting up ...</Header>
      <Icon iconURL={checkIcon} width="100px" />

      <SubTitle className="md">All set!</SubTitle>
    </Wrapper>
  );
};

export default HanaWalletSimulation;
