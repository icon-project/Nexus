'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of transactions.
// GET /transactions
async function getTransHistory(request, response) {
  let from = request.query.from || '';
  let to = request.query.to || '';
  let assetName = request.query.assetName || '';
  let page = Number(request.query.page) || 0;
  let limit = Number(request.query.limit) || 20;

  let transHistory = await model.getTrans(page, limit, from, to, assetName);

  if (!transHistory)
    return response.sendStatus(HttpStatus.NotFound);

  response.status(HttpStatus.OK).json({
    content: [...transHistory.transactions],
    total: transHistory.total,
  });
}

// Show the list of transactions.
// GET /transactions/:id
async function getTransaction(request, response) {
  let id = request.params.id;
  if (!id) {
    return response.sendStatus(HttpStatus.BadRequest);
  }

  let trans = await model.getTransById(id);

  if (!trans) return response.sendStatus(HttpStatus.NotFound);

  response.status(HttpStatus.OK).json({
    content: { ...trans, internalTransactions: [] },
  });
}

module.exports = {
  getTransHistory,
  getTransaction,
};
