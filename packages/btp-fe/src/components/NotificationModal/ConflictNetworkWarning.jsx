import styled from 'styled-components/macro';
import { TextMixin } from 'components/Typography/Text';

const Wrapper = styled.div`
  ${TextMixin.md};

  > ul {
    margin-top: 15px;

    li:not(:last-child) {
      margin-bottom: 5px;
    }
  }
`;

export const ConflictNetworkWarning = ({ sourceList }) => {
  if (!sourceList || sourceList.length === 0) return '';
  return (
    <Wrapper>
      Please configure MetaMask to connect{' '}
      {sourceList.length === 1 ? (
        sourceList[0].id + ' network.'
      ) : (
        <>
          one of supported network:
          <ul>
            {sourceList.map((item) => (
              <li key={item.id}>{item.id}</li>
            ))}
          </ul>
        </>
      )}
    </Wrapper>
  );
};
