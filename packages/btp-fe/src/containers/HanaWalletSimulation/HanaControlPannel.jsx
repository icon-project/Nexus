import { useState } from 'react';
import styled from 'styled-components/macro';
import { SubTitle, Text } from 'components/Typography';

const Wrapper = styled.div`
  width: 300px;
  border-radius: 20px 20px 0 0;

  transition: right 1s;
  position: fixed;
  top: 100px;
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
  const [displayConnectingRequest] = useState(false);
  const [displaySigningRequest] = useState(true);
  const [hide, setHide] = useState(false);

  const toggleHide = () => {
    setHide(!hide);
  };

  const onCancel = () => {
    toggleHide();
  };

  return (
    <Wrapper $hide={hide}>
      <SubTitle className="md">HANA WALLET (simulation)</SubTitle>

      {displayConnectingRequest && (
        <ConnectingRequest>
          <Text className="sm">Nexus would like to connect to your Hana wallet.</Text>
          <ButtonControl>
            <button onClick={onCancel}>Cancel</button>
            <button>Authorize</button>
          </ButtonControl>
        </ConnectingRequest>
      )}

      {displaySigningRequest && (
        <SigningRequest>
          <Text className="sm">Nexus would like to sign a transaction.</Text>
          <ButtonControl>
            <button onClick={onCancel}>Cancel</button>
            <button>Sign</button>
          </ButtonControl>
        </SigningRequest>
      )}
    </Wrapper>
  );
};

export default HanaControlPannel;
