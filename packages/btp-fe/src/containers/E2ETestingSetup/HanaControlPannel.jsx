import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import IconService, { IconBuilder } from 'icon-sdk-js';

import { useSelect } from 'hooks/useRematch';
import { SubTitle, Text } from 'components/Typography';

const Wrapper = styled.div`
  width: 300px;
  z-index: 1000;
  border-radius: 20px 20px 0 0;

  transition: right 1s;
  position: fixed;
  top: 150px;
  right: ${({ $hide }) => ($hide ? '-100%' : '0')};

  background-color: rgb(244, 246, 248);

  .subtitle-text {
    border-radius: 19px 19px 0 0;
    background-color: rgb(28, 34, 96);
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .plain-text {
    color: rgb(16, 15, 16);
    text-align: center;
  }
`;

const ConnectingRequest = styled.div`
  padding: 30px;
`;

const SigningRequest = styled.div`
  padding: 30px;
`;

const ButtonControl = styled.div`
  margin-top: 50px;
  display: flex;

  > button {
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    background-color: transparent;
  }

  > button:first-child {
    flex: 1;
    border: 1px solid rgb(28, 34, 96);
    margin-right: 10px;
  }

  > button:last-child {
    flex: 2;
    background-color: rgb(28, 34, 96);
    color: rgb(244, 246, 248);
  }
`;

const HanaControlPannel = () => {
  const [displayConnectingRequest, setDisplayConnectingRequest] = useState(false);
  const [hide, setHide] = useState(true);
  const address = 'hx6d338536ac11a0a2db06fb21fe8903e617a6764d';
  const privateKey = 'ad06b6bd754a4ccfe83c75884106efbe69e9f9ee30087225016a1219fa8dfd9a';

  const { selectE2ETestMode } = useSelect(({ e2e: { selectE2ETestMode } }) => ({
    selectE2ETestMode,
  }));

  useEffect(() => {
    if (selectE2ETestMode) {
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
            setDisplayConnectingRequest(true);
            setHide(false);

            break;
          case 'REQUEST_JSON-RPC':
            setDisplayConnectingRequest(false);
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
    }
  }, [selectE2ETestMode]);

  const onCancel = () => {
    window.dispatchEvent(
      new CustomEvent('ICONEX_RELAY_RESPONSE', {
        detail: {
          type: 'CANCEL_JSON-RPC',
        },
      }),
    );
    setHide(true);
  };

  const onAuthorize = () => {
    window.dispatchEvent(
      new CustomEvent('ICONEX_RELAY_RESPONSE', {
        detail: {
          type: 'RESPONSE_ADDRESS',
          payload: address,
        },
      }),
    );

    setHide(true);
  };

  const onSigning = () => {
    const tx = window['e2eTx'];

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
    } = tx;
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

    window.dispatchEvent(
      new CustomEvent('ICONEX_RELAY_RESPONSE', {
        detail: {
          type: 'RESPONSE_JSON-RPC',
          payload: new IconService.SignedTransaction(
            txObj,
            new IconService.IconWallet.loadPrivateKey(privateKey),
          ).getSignature(),
        },
      }),
    );

    setHide(true);
  };

  return (
    <>
      {selectE2ETestMode && (
        <Wrapper $hide={hide}>
          <SubTitle className="md">HANA WALLET (simulation)</SubTitle>

          {displayConnectingRequest ? (
            <ConnectingRequest>
              <Text className="sm">Nexus would like to connect to your Hana wallet.</Text>
              <ButtonControl>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onAuthorize} id="hana-simulation-authorize-button">
                  Authorize
                </button>
              </ButtonControl>
            </ConnectingRequest>
          ) : (
            <SigningRequest>
              <Text className="sm">Nexus would like to sign a transaction.</Text>
              <ButtonControl>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onSigning}>Sign</button>
              </ButtonControl>
            </SigningRequest>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default HanaControlPannel;
