import { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import styled from 'styled-components/macro';

import { Tooltip } from 'components/Tooltip';

import { colors } from 'components/Styles/Colors';
import { smallText } from 'components/Typography/Text';

const Wrapper = styled.div`
  ${smallText}
  width: 100%;
  display: inline-flex;
  text {
    position: absolute;
    padding: 4px 8px;
    background-color: #1d1b22;
    border-radius: 4px;
    border: 1px solid #312f39;
    color: ${colors.grayText};
    fill: ${colors.grayText};
    font-size: 5px;
  }
  .pie-chart {
    margin-right: 58px;
    width: 220px;
    height: 220px;
  }
  .desc-element {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    height: 20px;
  }
  .fist-col {
    display: flex;
    align-items: center;
    width: 80px;
  }
  .donut-tooltip {
    position: fixed;
    .value {
      font-size: 10px;
      line-height: 16px;
      letter-spacing: 0.75px;
      color: ${colors.graySubText};
    }
  }
`;

const Circle = styled.div`
  width: 8px;
  height: 8px;
  background: ${(props) => props.color || '#5465FF'};
  border-radius: 50%;
  margin-right: 6px;
`;

const dataMock = [
  { title: 'BTC', value: 44212657.57, color: '#5465FF' },
  { title: 'FIL', value: 43849442.72, color: '#FFBA49' },
  { title: 'DOGE', value: 21509669.66, color: '#7FDEFF' },
  { title: 'ZEC', value: 8469134.19, color: '#878490' },
  { title: 'DGB', value: 4002129.71, color: '#F05365' },
  { title: 'BCH', value: 3300013.75, color: '#AB67EF' },
  { title: 'OTHER', value: 1323154.84, color: '#5EF38C' },
];

const DonutChart = ({ chartId }) => {
  const [hovered, setHovered] = useState(null);
  const setTooltipPosition = (x, y) => {
    const tooltipStyle = document.getElementById(`donut-tooltip-${chartId}`).style;
    x = x - 50;
    y = y - 60;
    tooltipStyle.left = `${x}px`;
    tooltipStyle.top = `${y}px`;
  };
  return (
    <Wrapper>
      <PieChart
        className="pie-chart"
        data={dataMock}
        lineWidth={50}
        animate
        onMouseOver={(e, index) => {
          if (index !== hovered) {
            setTooltipPosition(e.clientX, e.clientY);
            setHovered(index);
          }
        }}
        onMouseOut={() => {
          setHovered(null);
        }}
      />
      <div id={`donut-tooltip-${chartId}`} className="donut-tooltip">
        {typeof hovered === 'number' && (
          <Tooltip width={100} direction="bottom">
            <div>{dataMock[hovered].title}</div>
            <div className="value">${dataMock[hovered].value}</div>
          </Tooltip>
        )}
      </div>
      <table className="desc">
        <tbody>
          {dataMock.map(({ title, color, value }) => {
            return (
              <tr key={title} className="desc-element">
                <td className="fist-col">
                  <Circle color={color} />
                  <span>{title}</span>
                </td>
                <td>
                  <span>${value.toLocaleString()}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default DonutChart;
