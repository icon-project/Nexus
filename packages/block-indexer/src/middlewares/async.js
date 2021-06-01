const Boom = require('@hapi/boom');

// References:
// https://nemethgergely.com/error-handling-express-async-await/
// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
function asyncMiddleware(fn) {
  return function (request, response, next) {
    // Could wrap fn in a promise to implicitly accept a sync. function.
    // return Promise.resolve(fn(request, response, next)).catch(...
    return fn(request, response, next).catch(error => {
      if (Boom.isBoom(error))
        next(error);
      else
        next(Boom.badImplementation(error));
    });
  };
}

module.exports = asyncMiddleware;
