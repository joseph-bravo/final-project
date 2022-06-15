const ClientError = require('../lib/client-error');
const argon2 = require('argon2');
const db = require('../lib/db');

module.exports = function authSignUp(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `/* SQL */
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        on conflict ("username")
        do nothing
        returning "userId", "username"
        ;
      `;
      return db.query(sql, [username, hashedPassword]);
    })
    .then(reSQL => {
      const {
        rows: [newUser]
      } = reSQL;
      if (!newUser) {
        throw new ClientError(409, 'username already taken');
      }
      const { username, userId } = newUser;
      res.status(201).json({ username, userId });
    })
    .catch(err => next(err));
};
