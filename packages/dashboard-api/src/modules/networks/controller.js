'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

async function getNetworksInfo(request, response) {
  const networkConnectedIcon = await model.getListNetworkConnectedIcon();

  response.status(HttpStatus.OK).json({
    content:{
      networks: networkConnectedIcon,
    }
  });
}

async function getNetworkInfoById(request, response) {
  const networkInfo = await model.getNetworkById(request.params.id);

  if (!networkInfo)
    return response.sendStatus(HttpStatus.NotFound);

  response.status(HttpStatus.OK).json({
    content: {
      tokens: [...networkInfo]
    }
  });
}

module.exports = {
  getNetworksInfo,
  getNetworkInfoById
};
