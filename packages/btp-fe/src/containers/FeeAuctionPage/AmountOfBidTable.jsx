import styled from 'styled-components/macro';

import { HorizontalScrollContainer } from 'components/HorizontalScrollContainer';
import { smallBoldText } from 'components/Typography/Text';
import { smallBoldHeader } from 'components/Typography/Header';
import { colors } from 'components/Styles/Colors';

const Table = styled.table`
  flex: 1;
  th,
  td {
    ${smallBoldText};
    text-align: left;
    padding: 1.5px 20px;
    color: ${colors.grayScaleSubText};
  }

  td {
    ${smallBoldHeader};
  }
`;

const values = [
  { symbol: 'ICX', bid: 100 },
  { symbol: 'ICX', bid: 100 },
  { symbol: 'ICX', bid: 100 },
  { symbol: 'ICX', bid: 100 },
  { symbol: 'ICX', bid: 100 },
  { symbol: 'ICX', bid: 100 },
  { symbol: 'ICX', bid: 100 },
  { symbol: 'BTC', bid: 100 },
  { symbol: 'BTC', bid: 100 },
  { symbol: 'BTC', bid: 100 },
  { symbol: 'BTC', bid: 100 },
  { symbol: 'BTC', bid: 100 },
  { symbol: 'BTC', bid: 100 },
];

export const AmountOfBidTable = () => {
  return (
    <HorizontalScrollContainer>
      <Table>
        <thead>
          <tr>
            {values.map(({ symbol }, idx) => (
              <th key={idx}>{symbol}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {values.map(({ bid }, idx) => (
              <td key={idx}>{bid}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </HorizontalScrollContainer>
  );
};
