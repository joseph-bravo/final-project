const ClientError = require('../lib/client-error');
const kebabCase = require('lodash/kebabCase');
const db = require('../lib/db');
const {
  s3Middleware: { download }
} = require('../middlewares/');

module.exports = function postsDownloadId(req, res, next) {
  const { id } = req.params;
  if (Number.isNaN(Number(id))) {
    throw new ClientError(400, 'please provide a valid post ID (number)');
  }
  if (!(id >= 1) || !(id <= 2147483647)) {
    throw new ClientError(400, 'integer out of bounds');
  }
  const sql = `/* SQL */
    select
      "fileObjectKey", "title"
    from
      "posts"
    where
      "postId" = $1;
  `;
  // prettier-ignore
  db.query(sql, [id])
    .then(reSQL => {
      if (!reSQL.rows[0]) {
        throw new ClientError(404, `unable to find entry with id: ${id}`);
      }
      const [{ fileObjectKey, title }] = reSQL.rows;
      const titleFiltered = title.match(/[\w\d]/g);
      const filename = titleFiltered ? kebabCase(titleFiltered.join('')) : 'symbol-file';
      download(fileObjectKey, `${filename}.sar`).then(downloadURL => {
        res.redirect(downloadURL);
      });
    })
    .catch(err => next(err));
};
