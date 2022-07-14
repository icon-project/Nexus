import { useEffect } from 'react';
import styled from 'styled-components/macro';

import { Header, SubTitle } from 'components/Typography';
import { Icon } from 'components/Icon';

import { useDispatch, useSelect } from 'hooks/useRematch';

import checkIcon from 'assets/images/green-checked-icon.svg';

const Wrapper = styled.div`
  padding: 80px;
  text-align: center;

  > img {
    margin: 50px 0 20px;
  }
`;

const HanaWalletSimulation = () => {
  const { setE2EState, setHanaWallet } = useDispatch(({ e2e: { setE2EState, setHanaWallet } }) => ({
    setE2EState,
    setHanaWallet,
  }));

  const {
    selectHanaWallet: {
      keys: { address },
    },
  } = useSelect(({ e2e: { selectHanaWallet } }) => ({
    selectHanaWallet,
  }));

  useEffect(() => {
    setE2EState(['E2ETestMode', true]);
  }, [setE2EState]);

  useEffect(() => {
    const handler = (event) => {
      const { type, payload } = event.detail;
      let responseEvt = null;

      switch (type) {
        case 'REQUEST_HAS_ADDRESS':
          responseEvt = new CustomEvent('ICONEX_RELAY_RESPONSE', {
            detail: {
              type: 'RESPONSE_HAS_ADDRESS',
              payload: {
                hasAddress: payload === address,
              },
            },
          });
          break;

        case 'REQUEST_HAS_ACCOUNT':
          responseEvt = new CustomEvent('ICONEX_RELAY_RESPONSE', {
            detail: {
              type: 'RESPONSE_HAS_ACCOUNT',
            },
          });
          break;
        case 'REQUEST_ADDRESS':
          setHanaWallet(['content', 'connecting']);
          break;
        case 'REQUEST_JSON-RPC':
          setHanaWallet(['content', 'signing']);
          window['e2eTx'] = payload;
          break;
        default:
          break;
      }

      if (responseEvt) {
        window.dispatchEvent(responseEvt);
      }
    };

    window.addEventListener('ICONEX_RELAY_REQUEST', handler);
  }, [address, setHanaWallet]);

  return (
    <Wrapper>
      <Header className="sm">E2E Test setting up ...</Header>
      <Icon iconURL={checkIcon} width="100px" />

      <SubTitle className="md">All set!</SubTitle>
    </Wrapper>
  );
};

export default HanaWalletSimulation;
