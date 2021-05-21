function debugLogMiddleware(debug) {
  return function (request, response, next) {
    if ('GET' === request.method)
      debug(`${request.method} ${request.originalUrl}`);
    else
      debug('%s %s, %O', request.method, request.originalUrl, request.body);

    next();
  };
}

module.exports = debugLogMiddleware;
