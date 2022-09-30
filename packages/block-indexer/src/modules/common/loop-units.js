const { NEAR_LOOP_UNIT, ICX_LOOP_UNIT } = require('../../common');

const loopUnitConverter = new Map();

function setLoopUnitConverter() {
  loopUnitConverter.set('NEAR', NEAR_LOOP_UNIT);
  loopUnitConverter.set('ICX', ICX_LOOP_UNIT);
}

function getLoopUnitByTokenName(tokenName) {
  return loopUnitConverter.get(tokenName.toLocaleUpperCase()) || 1;
}

module.exports = {
  setLoopUnitConverter,
  getLoopUnitByTokenName
};
