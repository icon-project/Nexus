import { useEffect } from 'react';
import IconService, { IconBuilder } from 'icon-sdk-js';
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
  const address = 'hx6d338536ac11a0a2db06fb21fe8903e617a6764d';
  const privateKey = 'ad06b6bd754a4ccfe83c75884106efbe69e9f9ee30087225016a1219fa8dfd9a';

  const { setE2EState } = useDispatch(({ e2e: { setE2EState } }) => ({
    setE2EState,
  }));

  useEffect(() => {
    setE2EState(['E2ETestMode', true]);
  }, [setE2EState]);

  useEffect(() => {
    const handler = (event) => {
      const { type, payload } = event.detail;
      console.log(
        '🚀 ~ file: HanaWalletSimulation.jsx ~ line 6 ~ window.addEventListener ~ event',
        event,
      );

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
          responseEvt = new CustomEvent('ICONEX_RELAY_RESPONSE', {
            detail: {
              type: 'RESPONSE_ADDRESS',
              payload: address,
            },
          });
          break;
        case 'REQUEST_JSON-RPC':
          const {
            params: {
              from,
              nid,
              nonce,
              stepLimit,
              timestamp,
              to,
              value,
              version,
              data: { method, params },
            },
          } = payload;
          const { CallTransactionBuilder } = IconBuilder;

          let txObj = new CallTransactionBuilder()
            .from(from)
            .to(to)
            .stepLimit(stepLimit)
            .nid(nid)
            .nonce(nonce)
            .version(version)
            .timestamp(timestamp)
            .params(params);
          if (value) {
            txObj = txObj.value(value);
          }

          if (method) {
            txObj = txObj.method(method).params(params);
          }

          txObj = txObj.build();
          console.log('🚀 ~ file: HanaWalletSimulation.jsx ~ line 76 ~ handler ~ txObj', txObj);

          responseEvt = new CustomEvent('ICONEX_RELAY_RESPONSE', {
            detail: {
              type: 'RESPONSE_JSON-RPC',
              payload: new IconService.SignedTransaction(
                txObj,
                new IconService.IconWallet.loadPrivateKey(privateKey),
              ).getSignature(),
            },
          });
          break;
        default:
          break;
      }

      if (responseEvt) {
        window.dispatchEvent(responseEvt);
      }
    };

    window.addEventListener('ICONEX_RELAY_REQUEST', handler);
  }, []);

  return (
    <Wrapper>
      <Header className="sm">E2E Test setting up ...</Header>
      <Icon iconURL={checkIcon} width="100px" />

      <SubTitle className="md">All set!</SubTitle>
    </Wrapper>
  );
};

export default HanaWalletSimulation;