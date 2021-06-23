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

const shortenNumber = (num) => {
  num = num + '';
  const { length } = num;
  switch (true) {
    case length > 9:
      return num.slice(0, -9) + ' B';
    case length > 6:
      return num.slice(0, -6) + ' M';
    default:
      return num;
  }
};

export { isEmpty, filterObjectByKeyArr, hashShortener, shortenNumber };
