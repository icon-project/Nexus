'use strict';

const BMC_ADDRESS_MAP = new Map();
const BSH_ADDRESS_MAP = new Map();

function setBMCAddressMap() {
  BMC_ADDRESS_MAP.set(process.env.ICON_BSC_BMC_ADDRESS, 'BSC');
  BMC_ADDRESS_MAP.set(process.env.ICON_WPS_BMC, 'WPS');
  BMC_ADDRESS_MAP.set(process.env.ICON_HMNY_BMC_ADDRESS, 'HARMONY');
}
function setBSHAddressMap() {
  BSH_ADDRESS_MAP.set(process.env.ICON_NATIVE_COIN_BSC_BSH_ADDRESS, 'BSC');
  BSH_ADDRESS_MAP.set(process.env.ICON_NATIVE_COIN_HMNY_BSH_ADDRESS, 'HARMONY');
}

function getBMCAddressesMap() {
  return BMC_ADDRESS_MAP;
}

function getBSHAddressesMap() {
  return BSH_ADDRESS_MAP;
}

module.exports = {
  setBMCAddressMap,
  setBSHAddressMap,
  getBMCAddressesMap,
  getBSHAddressesMap
};
