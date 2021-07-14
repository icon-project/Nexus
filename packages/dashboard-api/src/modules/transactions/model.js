'use strict';

const { getNetworkById } = require('../networks/repository');
const { getTransactions, getTransactionById } = require('./repository');

async function getTrans(page, limit, from, to) {
  return getTransactions(page, limit, from, to);
}

async function getTransById(id) {
  let transation = await getTransactionById(id);
  if (Object.keys(transation).length > 0) {
    transation.networkNameDst = transation.networkNameSrc;
    let addressPaths = transation.toAddress.match(/\w+/g);
    // Ref the pattern of a btp address
    // btp://0x1.icon/cx87ed9048b594b95199f326fc76e76a9d33dd665b
    // https://github.com/icon-project/btp#introduction
    if (addressPaths.length == 4) {
      let networkDst = await getNetworkById(addressPaths[1]);
      transation.networkNameDst = networkDst.name;
    }
  }
  return transation;
}
module.exports = {
  getTrans,
  getTransById,
};
