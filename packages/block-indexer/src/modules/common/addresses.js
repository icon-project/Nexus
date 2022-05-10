'use strict';

const BMC_ADDRESS_MAP = new Map();
const BSH_ADDRESS_MAP = new Map();

function initBMCAddressMap() {
  BMC_ADDRESS_MAP.set(process.env.ICON_BMC_ADDRESS, 'BSC');
  BMC_ADDRESS_MAP.set('cx9e5c0a749ee94c01febe04702184002a76a84f84', 'WPS');
  BMC_ADDRESS_MAP.set('cxa2cc386e9db2a72ea6724cbfd12f936a90ba63d2', 'HARMONY');
}
function initBSHAddressMap() {
  BSH_ADDRESS_MAP.set(process.env.ICON_NATIVE_COIN_BSH_ADDRESS, 'BSC');
  BSH_ADDRESS_MAP.set('cxc9d0ca76b1c8a036499a46a8e67999ade1ad333b', 'HARMONY');
}

function getBMCAddressesMap() {
  return BMC_ADDRESS_MAP;
}

function getBSHAddressesMap() {
  return BSH_ADDRESS_MAP;
}

module.exports = {
  initBMCAddressMap,
  initBSHAddressMap,
  getBMCAddressesMap,
  getBSHAddressesMap
};
