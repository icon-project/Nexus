'use strict';

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const HttpStatus = require('@tiendq/http-status');

const model = require('./model');

async function getNetworksInfo(request, response) {
    const networkConnectedIcon = await model.getListNetworkConnectedIcon();
    response.status(HttpStatus.OK).json({
          networkConnectedIcon,
      });
}


async function getNetworksById(request, response) {
    const id = request.params.id;
    const networkInfo = await model.getNetworkById(id);
    response.status(HttpStatus.OK).json({
        networkInfo,
      });
}

module.exports = {
    getNetworksInfo,
    getNetworksById
}