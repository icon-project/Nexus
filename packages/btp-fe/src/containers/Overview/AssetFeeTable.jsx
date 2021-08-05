import styled from 'styled-components/macro';

import { TextMixin, Text } from 'components/Typography/Text';
import { colors } from 'components/Styles/Colors';

import { shortenNumber } from 'utils/app';
import arrowDownIcon from 'assets/images/arrow-icon.svg';

const Wapper = styled.div`
  position: relative;

  > .table-container {
    max-height: 451px;
    overflow-y: auto;
    margin-bottom: 20px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > table {
      width: 100%;
      ${TextMixin.sm};

      th,
      td {
        padding: 10px 0;
        border-bottom: solid 1px ${colors.grayLine};
        text-align: left;

        &:nth-child(2) {
          text-align: right;
          padding-right: 18px;
        }
      }
    }
  }

  > .scroll-to-view {
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    > img {
      margin-right: 7px;
    }
  }
`;

export const AssetFeeTable = ({ assets }) => {
  return (
    <Wapper>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(({ name, value }, idx) => (
              <tr key={idx}>
                <td>{name.toUpperCase()}</td>
                <td>{shortenNumber(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {assets.length > 10 && (
        <Text className="xs scroll-to-view">
          <img src={arrowDownIcon} alt="icon" />
          Scroll to view more asset fee
        </Text>
      )}
    </Wapper>
  );
};
