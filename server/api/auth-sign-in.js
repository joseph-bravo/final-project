const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const db = require('../lib/db');
const ClientError = require('../lib/client-error');

module.exports = function authSignIn(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  const sql = `/* SQL */
    select *
    from "users"
    where "username" = $1;
  `;
  db.query(sql, [username])
    .then(reSQL => {
      const {
        rows: [user]
      } = reSQL;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { hashedPassword, userId, username } = user;
      return Promise.all([
        { userId, username },
        argon2.verify(hashedPassword, password)
      ]);
    })
    .then(([payload, isVerified]) => {
      if (!isVerified) {
        throw new ClientError(401, 'invalid login');
      }
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.json({ token, user: payload });
    })
    .catch(err => next(err));
};
