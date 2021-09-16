'use strict';

const { getNetworkById } = require('../networks/repository');
const { getTransactions, getTransactionByTxHash, countAllTransaction } = require('./repository');

async function getTrans(page, limit, from, to, assetName) {
  return await getTransactions(page, limit, from, to, assetName);
}

async function getTotalTransaction() {
  return countAllTransaction();
}

async function getTransactionByHash(hash) {
  let transaction = await getTransactionByTxHash(hash);

  if (transaction) {
    if (Object.keys(transaction).length > 0) {
      transaction.networkNameDst = transaction.networkNameSrc;

      let addressPaths = transaction.toAddress.match(/\w+/g);
      // Ref the pattern of a btp address
      // btp://0x1.icon/cx87ed9048b594b95199f326fc76e76a9d33dd665b
      // https://github.com/icon-project/btp#introduction
      if (addressPaths.length == 4) {
        let networkDst = await getNetworkById(addressPaths[1]);
        transaction.networkNameDst = networkDst[0].name;
      }
    }

    return transaction;
  }
}

module.exports = {
  getTrans,
  getTransactionByHash,
  getTotalTransaction,
};
