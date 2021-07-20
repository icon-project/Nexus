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

export const roundNumber = (num, digit = 2) => {
  return +(Math.round(num + `e+${digit}`) + `e-${digit}`);
};

const shortenNumber = (num) => {
  if (num === undefined) return 0;
  const intNum = (num + '').split('.')[0];
  const { length } = intNum;
  switch (true) {
    case length > 12:
      return roundNumber(num / 1000000000000).toLocaleString() + ' T';
    case length > 9:
      return roundNumber(num / 1000000000).toLocaleString() + ' B';
    case length > 6:
      return roundNumber(num / 1000000).toLocaleString() + ' M';
    default:
      return (+num).toLocaleString();
  }
};

export { isEmpty, filterObjectByKeyArr, hashShortener, shortenNumber };
