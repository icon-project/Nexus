import styled from 'styled-components/macro';

import { Icon } from 'components/Icon';
import { HorizontalScrollContainer } from 'components/HorizontalScrollContainer';
import { smallText } from 'components/Typography/Text';
import { colors } from 'components/Styles/Colors';

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

const TH = ({ children, icon }) => (
  <th>
    <Icon icon={icon} width="16px" style="margin-right: 4px" />
    {children}
  </th>
);

const values = [
  { icon: 'eth', symbol: 'ETH', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
];

export const AssetFeeTable = () => {
  return (
    <HorizontalScrollContainer>
      <Table>
        <thead>
          <tr>
            <th></th>
            {values.map(({ icon, symbol }, idx) => (
              <TH icon={icon} key={idx}>
                {symbol}
              </TH>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fee</td>
            {values.map(({ fee }, idx) => (
              <td key={idx}>{fee}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </HorizontalScrollContainer>
  );
};
