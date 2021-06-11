import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { createChart } from 'lightweight-charts';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

const intervals = ['D', 'W', 'M'];
const dayData = [
  { time: '2020-09-19', value: 1 },
  { time: '2020-10-22', value: 2 },
  { time: '2020-10-23', value: 2.5 },
  { time: '2020-10-24', value: 3 },
  { time: '2020-11-25', value: 10 },
  { time: '2020-12-30', value: 8 },
  { time: '2020-12-31', value: 6 },
  { time: '2021-01-01', value: 1 },
  { time: '2021-01-02', value: 0.8 },
  { time: '2021-02-05', value: 0.4 },
  { time: '2021-02-06', value: 0.3 },
  { time: '2021-03-13', value: 4 },
  { time: '2021-04-14', value: 6 },
  { time: '2021-05-15', value: 6.6 },
  { time: '2021-05-16', value: 6.8 },
  { time: '2021-05-17', value: 7 },
  { time: '2021-05-20', value: 7.5 },
  { time: '2021-06-21', value: 8 },
];

const weekData = [
  { time: '2016-07-18', value: 26.1 },
  { time: '2016-07-25', value: 26.19 },
  { time: '2016-08-01', value: 26.24 },
  { time: '2016-08-08', value: 26.22 },
  { time: '2016-08-15', value: 25.98 },
  { time: '2016-08-22', value: 25.85 },
  { time: '2016-08-29', value: 25.98 },
  { time: '2016-09-05', value: 25.71 },
  { time: '2016-09-12', value: 25.84 },
  { time: '2016-09-19', value: 25.89 },
  { time: '2016-09-26', value: 25.65 },
  { time: '2016-10-03', value: 25.69 },
  { time: '2016-10-10', value: 25.67 },
  { time: '2016-10-17', value: 26.11 },
  { time: '2016-10-24', value: 25.8 },
  { time: '2016-10-31', value: 25.7 },
  { time: '2016-11-07', value: 25.4 },
  { time: '2016-11-14', value: 25.32 },
  { time: '2016-11-21', value: 25.48 },
  { time: '2016-11-28', value: 25.08 },
  { time: '2016-12-05', value: 25.06 },
  { time: '2016-12-12', value: 25.11 },
  { time: '2016-12-19', value: 25.34 },
  { time: '2017-09-18', value: 26.5 },
  { time: '2017-09-25', value: 26.39 },
  { time: '2017-10-02', value: 25.95 },
  { time: '2017-10-09', value: 26.15 },
  { time: '2017-10-16', value: 26.43 },
  { time: '2017-10-23', value: 26.22 },
  { time: '2017-10-30', value: 26.14 },
  { time: '2017-11-06', value: 26.08 },
  { time: '2017-11-13', value: 26.27 },
  { time: '2017-11-20', value: 26.3 },
  { time: '2017-11-27', value: 25.92 },
  { time: '2018-12-10', value: 25.52 },
  { time: '2018-12-17', value: 25.66 },
  { time: '2018-12-24', value: 25.68 },
  { time: '2018-12-31', value: 25.71 },
  { time: '2019-01-07', value: 25.92 },
  { time: '2019-01-14', value: 25.6 },
  { time: '2019-01-21', value: 25.8 },
  { time: '2019-01-28', value: 25.6 },
  { time: '2019-02-04', value: 25.72 },
  { time: '2019-02-11', value: 25.89 },
  { time: '2019-02-18', value: 26.0 },
  { time: '2019-02-25', value: 25.86 },
  { time: '2019-03-04', value: 25.94 },
  { time: '2019-03-11', value: 26.11 },
  { time: '2019-03-18', value: 25.88 },
  { time: '2019-03-25', value: 25.77 },
  { time: '2019-04-01', value: 26.16 },
  { time: '2019-04-08', value: 26.04 },
  { time: '2019-04-15', value: 26.0 },
  { time: '2019-04-22', value: 25.88 },
  { time: '2019-04-29', value: 26.02 },
  { time: '2019-05-06', value: 26.08 },
  { time: '2019-05-13', value: 26.09 },
  { time: '2019-05-20', value: 26.16 },
  { time: '2019-05-27', value: 26.23 },
];

const monthData = [
  { time: '2006-12-01', value: 25.4 },
  { time: '2007-01-01', value: 25.5 },
  { time: '2007-02-01', value: 25.11 },
  { time: '2007-03-01', value: 25.24 },
  { time: '2007-04-02', value: 25.34 },
  { time: '2007-05-01', value: 24.82 },
  { time: '2007-06-01', value: 23.85 },
  { time: '2007-07-02', value: 23.24 },
  { time: '2007-08-01', value: 23.05 },
  { time: '2007-09-03', value: 22.26 },
  { time: '2007-10-01', value: 22.52 },
  { time: '2007-11-01', value: 20.84 },
  { time: '2007-12-03', value: 20.37 },
  { time: '2008-01-01', value: 23.9 },
  { time: '2008-02-01', value: 22.58 },
  { time: '2008-03-03', value: 21.74 },
  { time: '2008-04-01', value: 22.5 },
  { time: '2008-05-01', value: 22.38 },
  { time: '2008-06-02', value: 20.58 },
  { time: '2008-07-01', value: 20.6 },
  { time: '2008-08-01', value: 20.82 },
  { time: '2008-09-01', value: 17.5 },
  { time: '2008-10-01', value: 17.7 },
  { time: '2008-11-03', value: 15.52 },
  { time: '2008-12-01', value: 18.58 },
  { time: '2009-01-01', value: 15.4 },
  { time: '2009-02-02', value: 11.68 },
  { time: '2009-03-02', value: 14.89 },
  { time: '2009-04-01', value: 16.24 },
  { time: '2009-05-01', value: 18.33 },
  { time: '2009-06-01', value: 18.08 },
  { time: '2009-07-01', value: 20.07 },
  { time: '2009-08-03', value: 20.35 },
  { time: '2009-09-01', value: 21.53 },
  { time: '2009-10-01', value: 21.48 },
  { time: '2009-11-02', value: 20.28 },
  { time: '2009-12-01', value: 21.39 },
  { time: '2010-01-01', value: 22.0 },
  { time: '2010-02-01', value: 22.31 },
  { time: '2010-03-01', value: 22.82 },
  { time: '2010-04-01', value: 22.58 },
  { time: '2010-05-03', value: 21.02 },
  { time: '2010-06-01', value: 21.45 },
  { time: '2010-07-01', value: 22.42 },
  { time: '2010-08-02', value: 23.61 },
  { time: '2010-09-01', value: 24.4 },
  { time: '2010-10-01', value: 24.46 },
  { time: '2010-11-01', value: 23.64 },
  { time: '2010-12-01', value: 22.9 },
  { time: '2011-01-03', value: 23.73 },
  { time: '2011-02-01', value: 23.52 },
  { time: '2011-03-01', value: 24.15 },
  { time: '2011-04-01', value: 24.37 },
  { time: '2011-05-02', value: 24.4 },
  { time: '2011-06-01', value: 24.45 },
  { time: '2011-07-01', value: 24.24 },
  { time: '2011-08-01', value: 24.0 },
  { time: '2011-09-01', value: 22.77 },
  { time: '2011-10-03', value: 24.21 },
  { time: '2011-11-01', value: 23.4 },
  { time: '2011-12-01', value: 23.9 },
  { time: '2012-01-02', value: 24.84 },
  { time: '2012-02-01', value: 25.04 },
  { time: '2012-03-01', value: 24.9 },
  { time: '2012-04-02', value: 25.06 },
  { time: '2012-05-01', value: 24.63 },
  { time: '2012-06-01', value: 25.07 },
  { time: '2012-07-02', value: 25.3 },
  { time: '2012-08-01', value: 25.08 },
  { time: '2012-09-03', value: 25.27 },
  { time: '2012-10-01', value: 25.39 },
  { time: '2012-11-01', value: 25.06 },
  { time: '2012-12-03', value: 25.03 },
  { time: '2013-01-01', value: 25.26 },
  { time: '2013-02-01', value: 25.2 },
  { time: '2013-03-01', value: 25.3 },
  { time: '2019-03-01', value: 25.77 },
  { time: '2019-04-01', value: 25.9 },
  { time: '2019-05-01', value: 26.23 },
];

const seriesesData = new Map([
  ['D', dayData],
  ['W', weekData],
  ['M', monthData],
]);

const Wrapper = styled.div`
  .switcher {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    margin-top: 28px;
    color: #878490;
    ${media.sm`
        margin-top: 8px;
    `}
  }

  .switcher-item {
    cursor: pointer;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: '#878491';
    background-color: transparent;
    margin-right: 8px;
    width: 24px;
    height: 24px;
    border: 1px solid #353242;
    border-radius: 4px;
    outline: none;
  }

  .switcher-item:hover {
    color: ${colors.grayText};
    background-color: ${colors.grayAccent};
  }

  .switcher-active-item {
    text-decoration: none;
    cursor: default;
    color: #262b3e;
  }

  .switcher-active-item,
  .switcher-active-item:hover {
    color: ${colors.grayText};
    background-color: ${colors.grayAccent};
  }
  .tv-lightweight-charts {
    ${media.sm`
        width: 320px !important;
    `}
  }
`;
const AreaChart = () => {
  const [isRendered, setIsRendered] = useState(false);
  const parentRef = useRef();
  const chartElement = document.createElement('div');

  function createSimpleSwitcher(items, activeItem, activeItemChangedCallback) {
    const switcherElement = document.createElement('div');
    switcherElement.classList.add('switcher');

    const intervalElements = items.map(function (item) {
      const itemEl = document.createElement('button');
      itemEl.innerText = item;
      itemEl.classList.add('switcher-item');
      itemEl.classList.toggle('switcher-active-item', item === activeItem);
      itemEl.addEventListener('click', function () {
        onItemClicked(item);
      });
      switcherElement.appendChild(itemEl);
      return itemEl;
    });

    function onItemClicked(item) {
      if (item === activeItem) {
        return;
      }

      intervalElements.forEach(function (element, index) {
        element.classList.toggle('switcher-active-item', items[index] === item);
      });

      activeItem = item;

      activeItemChangedCallback(item);
    }

    return switcherElement;
  }
  const switcherElement = createSimpleSwitcher(intervals, intervals[0], syncToInterval);
  const chart = createChart(chartElement, {
    width: 484,
    height: 250,
    layout: {
      backgroundColor: colors.brandSecondaryBase,
      textColor: colors.graySubText,
      fontFamily: 'Poppins',
      fontSize: 12,
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: '#353242',
        style: 2,
      },
    },
    rightPriceScale: {
      visible: false,
    },
    leftPriceScale: {
      visible: true,
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
    },
    localization: {
      // priceFormatter: (price) => price + ' B',
      locale: 'en-US',
    },
    crosshair: {
      vertLine: {
        width: 1,
        color: colors.warningState,
        style: 3,
      },
      horzLine: {
        visible: false,
      },
    },
  });

  chart.timeScale().fitContent();
  let areaSeries = null;

  function syncToInterval(interval) {
    if (areaSeries) {
      chart.removeSeries(areaSeries);
      areaSeries = null;
    }
    areaSeries = chart.addAreaSeries({
      topColor: 'rgba(84, 101, 255, 0.8)',
      bottomColor: 'rgba(84, 101, 255, 0.06)',
      lineColor: '#5465FF',
      lineWidth: 2,
    });
    areaSeries.setData(seriesesData.get(interval));
  }

  syncToInterval(intervals[0]);
  useEffect(() => {
    if (parentRef && chartElement && !isRendered) {
      parentRef.current.appendChild(chartElement);
      parentRef.current.appendChild(switcherElement);
      setIsRendered(true);
    }
  }, [chartElement, switcherElement, isRendered]);
  return (
    <Wrapper>
      <div ref={parentRef}></div>
    </Wrapper>
  );
};

export default AreaChart;
