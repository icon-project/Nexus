import styled from 'styled-components/macro';
import { media } from 'components/Styles/Media';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
const Wrapper = styled.div`
  .label {
    font-size: 14px;
  }
  .recharts-surface {
    width: 484px;
    ${media.sm`
        width: 320px;
    `}
  }
`;
const data = [
  {
    month: 'Sep',
    value: 100,
  },
  {
    month: 'Oct',
    value: 2000,
  },
  {
    month: 'Nov',
    value: 9900,
  },
  {
    month: 'Dec',
    value: 7000,
  },
  {
    month: '2021',
    value: 1500,
  },
  {
    month: 'Feb',
    value: 300,
  },
  {
    month: 'Mar',
    value: 5000,
  },
  {
    month: 'Apr',
    value: 6000,
  },
];

const CustomizedYAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-13} y={0} textAnchor="end" fill="#878491" fontSize={12} letterSpacing={0.75}>
        {payload.value / 1000}B
      </text>
    </g>
  );
};

const CustomizedXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={14} textAnchor="end" fill="#878491" fontSize={12} letterSpacing={0.75}>
        {payload.value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const GradientAreaChart = () => {
  return (
    <Wrapper>
      <AreaChart
        width={484}
        height={242}
        data={data}
        margin={{ top: 10, right: 30, left: -22, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="6%" stopColor="#5465FF" stopOpacity={0.8} />
            <stop offset="80%" stopColor="#5465FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis tickSize={0} axisLine={false} dataKey="month" tick={<CustomizedXAxisTick />} />
        <YAxis tickSize={0} axisLine={false} tickCount={6} tick={<CustomizedYAxisTick />} />
        <CartesianGrid vertical={false} stroke="#353242" strokeDasharray="5 5" />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#353242', strokeWidth: 2 }} />
        <Area
          dataKey="value"
          strokeWidth={2}
          stroke="#5465FF"
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </Wrapper>
  );
};
export default GradientAreaChart;
