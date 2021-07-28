import styled from 'styled-components/macro';

import { HorizontalScrollContainer } from 'components/HorizontalScrollContainer';
import { TextMixin } from 'components/Typography/Text';
import { HeaderMixin } from 'components/Typography/Header';
import { colors } from 'components/Styles/Colors';

import { shortenNumber } from 'utils/app';

const Table = styled.table`
  flex: 1;
  th,
  td {
    ${TextMixin.smBold};
    text-align: left;
    padding: 1.5px 20px;
    color: ${colors.grayScaleSubText};
    text-transform: uppercase;
  }

  td {
    ${HeaderMixin.smBold};
  }
`;

export const AmountOfBidTable = ({ fees }) => {
  return (
    <HorizontalScrollContainer>
      <Table>
        <thead>
          <tr>
            {fees.map(({ name }, idx) => (
              <th key={idx}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {fees.map(({ value }, idx) => (
              <td key={idx}>{shortenNumber(value)}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </HorizontalScrollContainer>
  );
};
