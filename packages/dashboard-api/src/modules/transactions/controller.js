'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');
const _ = require('lodash');

// Show the list of transactions.
// GET /transactions
async function getTransHistory(request, response) {
  let from = request.query.from || '';
  let to = request.query.to || '';
  let assetName = request.query.assetName || '';
  let page = Number(request.query.page) || 0;
  let limit = Number(request.query.limit) || 20;
  let startDate = _.get(request, 'query.startDate', null);
  let endDate = _.get(request, 'query.endDate', null);
  let status = _.get(request, 'query.status', null);
  if ((new Date(startDate)).toString() === 'Invalid Date') {
    response.status(HttpStatus.BadRequest).json({ startDate: 'invalid' });
  }
  if ((new Date(endDate)).toString() === 'Invalid Date') {
    response.status(HttpStatus.BadRequest).json({ endDate: 'invalid' });
  }

  let transHistory = await model.getTrans(page, limit, from, to, assetName, startDate, endDate, status);

  if (!transHistory)
    return response.sendStatus(HttpStatus.NotFound);

  response.status(HttpStatus.OK).json({
    content: [...transHistory.transactions],
    total: transHistory.total,
  });
}

// Show the list of transactions.
// GET /transactions/:hash
async function getTransaction(request, response) {
  let transaction = await model.getTransactionByHash(request.params.hash);

  if (!transaction)
    return response.sendStatus(HttpStatus.NotFound);

  response.status(HttpStatus.OK).json({
    content: { ...transaction }
  });
}

module.exports = {
  getTransHistory,
  getTransaction
};
