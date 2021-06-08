function propsAsString(object) {
  return Object.keys(object)
    .map(function (key) {
      return `"${object[key]}"`;
    })
    .join(', ');
}

function propsCountValueString(object) {
  return Object.keys(object)
    .map(function (key, index) {
      return `$${index + 1}`;
    })
    .join(', ');
}

function sortValuesWithPropsOrdered(objectGetValue, orderPropsObject) {
  return Object.keys(orderPropsObject).map(function (key) {
    return objectGetValue[key];
  });
}

function getCurrentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function hexToDecimal(hex) {
  return parseInt(hex.toString(16), 16);
}

module.exports = {
  propsAsString,
  propsCountValueString,
  sortValuesWithPropsOrdered,
  getCurrentTimestamp,
  hexToDecimal,
};
