import { PieChart } from 'react-minimal-pie-chart';
import styled from 'styled-components/macro';
import { smallText } from 'components/Typography/Text';
const Wrapper = styled.div`
  ${smallText}
  width: 100%;
  display: inline-flex;
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

const DonutChart = () => {
  return (
    <Wrapper>
      <PieChart className="pie-chart" data={dataMock} lineWidth={50} animate />
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
