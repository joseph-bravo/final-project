require('dotenv/config');
const { JsonWebTokenError, ...jwt } = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.header('x-access-token');
  if (!token) {
    req.userId = null;
  }

  try {
    // * Payload: {userId, username}
    const { userId } = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = userId;
  } catch (error) {
    throw new JsonWebTokenError();
  }

  next();
};
