const { randomUUID } = require('crypto');

module.exports = function middlewareGenUUID(req, res, next) {
  req.fileName = randomUUID();
  next();
};
