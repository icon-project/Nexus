import styled from 'styled-components/macro';

import { HorizontalScrollContainer } from 'components/HorizontalScrollContainer';
import { smallText } from 'components/Typography/Text';
import { colors } from 'components/Styles/Colors';

import { shortenNumber } from 'utils/app';

const Table = styled.table`
  th,
  td {
    text-align: center;
    padding: 14px 20px;
    ${smallText};

    img {
      margin-right: 4px;
    }
  }

  tbody {
    border-top: solid 1px ${colors.grayLine};
    border-bottom: solid 1px ${colors.grayLine};
  }
`;

export const AssetFeeTable = ({ assets }) => {
  return (
    <HorizontalScrollContainer>
      <Table>
        <thead>
          <tr>
            <th></th>
            {assets.map(({ name }, idx) => (
              <th key={idx}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fee</td>
            {assets.map(({ value }, idx) => (
              <td key={idx}>{shortenNumber(value)}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </HorizontalScrollContainer>
  );
};
