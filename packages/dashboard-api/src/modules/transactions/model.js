'use strict';

const { getNetworkById } = require('../networks/repository');
const { getTransactions, getTransactionByTxHash, countAllTransaction } = require('./repository');

const networkMap = new Map();

async function getTrans(page, limit, from, to, assetName, startDate, endDate, status) {
  const { transactions, total } = await getTransactions(page, limit, from, to, assetName, startDate, endDate, status);
  for (const transaction of transactions) {
    transaction.networkNameDst = transaction.networkNameSrc;

    transaction.networkNameDst = await getNetworkName(transaction.toAddress);
    delete transaction.toAddress;
  }
  return { transactions, total };
}

async function getTotalTransaction() {
  return countAllTransaction();
}

async function getTransactionByHash(hash) {
  let transaction = await getTransactionByTxHash(hash);

  if (transaction) {
    transaction.networkNameDst = transaction.networkNameSrc;
    transaction.networkNameDst = await getNetworkName(transaction.toAddress);
  }
  return transaction;
}

async function getNetworkName(btpAddress) {
  if (!btpAddress) {
    return;
  }
  let addressPaths = btpAddress.match(/\w+/g);
  // Ref the pattern of a btp address
  // btp://0x1.icon/cx87ed9048b594b95199f326fc76e76a9d33dd665b
  // https://github.com/icon-project/btp#introduction
  if (addressPaths.length >= 4) {
    if (networkMap.has(addressPaths[1])) {
      return networkMap.get(addressPaths[1]);
    } else {
      let networkDst = await getNetworkById(addressPaths[1]);
      networkMap.set(addressPaths[1], networkDst[0].name);
      return networkDst[0].name;
    }
  }
}

module.exports = {
  getTrans,
  getTransactionByHash,
  getTotalTransaction,
};
