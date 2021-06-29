import { fetchAPI } from 'utils/fetch';
const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const filterObjectByKeyArr = (objItem, keyArr) => {
  if (isEmpty(objItem) || !keyArr || keyArr.length < 1) return {};
  const filtered = Object.keys(objItem)
    .filter((key) => keyArr.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: objItem[key],
      };
    }, {});
  return filtered;
};

const hashShortener = (hashStr) => {
  if (!hashStr) return '';
  const len = hashStr.length;
  if (len <= 10) {
    return hashStr;
  }

  return `${hashStr.substring(0, 6)}...${hashStr.substring(len - 4)}`;
};

const roundToTwo = (num) => {
  return +(Math.round(num + 'e+2') + 'e-2');
};

const shortenNumber = (num) => {
  num = (num + '').split('.')[0];
  const { length } = num;
  switch (true) {
    case length > 9:
      return roundToTwo(num / 1000000000).toLocaleString() + ' B';
    case length > 6:
      return roundToTwo(num / 1000000).toLocaleString() + ' M';
    default:
      return (+num).toLocaleString();
  }
};

const getCoinInfo = async (coins) => {
  let coinNames = '';
  if (Array.isArray(coins)) {
    coinNames = coins.join(',');
  }

  try {
    const coinInfo = await fetchAPI('', {
      baseURL: `${process.env.REACT_APP_PRO_COIN_MARKETCAP_API_URL}/cryptocurrency/info?symbol=${coinNames}`,
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_PRO_COIN_MARKETCAP_API_KEY,
      },
    });
    console.log(coinInfo);
    return coinInfo.data;
  } catch (error) {
    console.log('API call error:', error.message);
    return {};
  }
};

const exchangeToFiat = async (coinName, fiatNames, amount) => {
  let prices = {};

  let fiatString = fiatNames.join(',');

  coinName = coinName.toUpperCase();
  const coinInfo = (await getCoinInfo([coinName]))[coinName];
  try {
    const response = await fetchAPI('', {
      baseURL: `${process.env.REACT_APP_PRO_COIN_MARKETCAP_API_URL}/tools/price-conversion?amount=${amount}&convert=${fiatString}&id=${coinInfo.id}`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_PRO_COIN_MARKETCAP_API_KEY,
      },
    });
    if (response.data && response.data[coinInfo.id]) {
      let pricingInfos = response.data[coinInfo.id].quote;
      for (const key in pricingInfos) {
        prices[key] = pricingInfos[key].price;
      }
    }
    return prices;
  } catch (error) {
    return {};
  }
};

export { isEmpty, filterObjectByKeyArr, hashShortener, shortenNumber, exchangeToFiat };
