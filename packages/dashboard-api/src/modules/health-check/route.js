const express = require('express');
const router = express.Router();
const { healthCheck } = require('./controller');
const { authentication } = require('./middleware');

// middleware that is specific to this router
router.use(authentication);

// get the healthcheck of indexers
router.post('/', healthCheck);

const createHealthCheckRoute = () => {
  return router;
};

module.exports = {
  createHealthCheckRoute
};
