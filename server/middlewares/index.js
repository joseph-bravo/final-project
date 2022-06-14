const devMiddleware = require('./dev-middleware');
const errorMiddleware = require('./error-middleware');
const s3Middleware = require('./s3-middleware');
const authMiddleware = require('./auth-middleware');

module.exports = {
  devMiddleware,
  errorMiddleware,
  s3Middleware,
  authMiddleware
};
