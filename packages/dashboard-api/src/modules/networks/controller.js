'use strict';

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
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
    if (!request.params && !request.params.id) {
        return response.sendStatus(HttpStatus.BadRequest);
    }
    const networkId = request.params.id;
    const networkInfo = await model.getNetworkById(networkId);
    response.status(HttpStatus.OK).json({
        content: {
            network: networkInfo,
        }
    });
}

module.exports = {
    getNetworksInfo,
    getNetworkInfoById
}