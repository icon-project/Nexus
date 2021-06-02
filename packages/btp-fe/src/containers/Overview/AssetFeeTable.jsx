import { useRef } from 'react';
import styled from 'styled-components/macro';

import { Icon } from 'components/Icon';
import { smallText } from 'components/Typography/Text';
import { colors } from 'components/Styles/Colors';

import leftArrow from '../../assets/images/left-arrow.svg';

const Wrapper = styled.div`
  width: 100%;
  position: relative;

  .container {
    overflow-y: scroll;
    width: 100%;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }

    .content {
      white-space: nowrap;

      table {
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
      }
    }
  }

  button {
    background: transparent center / 40% no-repeat url('${leftArrow}');
    width: 15px;
    height: 15px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -20px;

    &.next {
      transform: translateY(-50%) rotate(180deg);
      left: unset;
      right: -20px;
    }
  }
`;

const TH = ({ children, icon }) => (
  <th>
    <Icon icon={icon} width="16px" style="margin-right: 4px" />
    {children}
  </th>
);

const values = [
  { icon: 'binance', symbol: 'BTC', fee: 0.25 },
  { icon: 'eth', symbol: 'ETH', fee: 0.1 },
  { icon: 'iconex', symbol: 'ICX', fee: 0.1 },
  { icon: 'metaMask', symbol: 'Chainlink', fee: 0.1 },
  { icon: 'edgeware', symbol: 'Chainlink', fee: 0.1 },
  { icon: 'copy', symbol: 'Chainlink', fee: 0.1 },
];

export const AssetFeeTable = () => {
  const containerRef = useRef();

  const sideScroll = (direction, speed, distance, step) => {
    const element = containerRef.current;
    let scrollAmount = 0;

    var slideTimer = setInterval(function () {
      if (direction == 'left') {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  };

  const onNext = () => {
    sideScroll('right', 25, 100, 10);
  };

  const onBack = () => {
    sideScroll('left', 25, 100, 10);
  };

  return (
    <Wrapper>
      <div className="container" ref={containerRef}>
        <div className="content">
          <table>
            <thead>
              <tr>
                <th></th>
                {values.map(({ icon, symbol }) => (
                  <TH icon={icon} key={icon}>
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
          </table>
        </div>
      </div>
      <button onClick={onBack} type="button"></button>
      <button onClick={onNext} className="next" type="button"></button>
    </Wrapper>
  );
};
