import styled from 'styled-components/macro';
import { Text } from 'components/Typography';

const Wrapper = styled.div`
  a {
    color: inherit;
    font-weight: bold;
    text-decoration: underline;
  }
`;

export const BetaNotification = () => {
  return (
    <Wrapper>
      <Text className="md">
        Nexus is in Beta. Please use at your own risk.{' '}
        <a
          href="https://docs.google.com/document/d/149WaRX1ajU1z5urKbxhe7wUYsj-zEgbwFleJPWpuWMA/edit"
          target="_blank"
          rel="noreferrer"
        >
          Click here
        </a>{' '}
        for full Terms of Use.
      </Text>
    </Wrapper>
  );
};
