const ClientError = require('../lib/client-error');
const db = require('../lib/db');

module.exports = function postsViewId(req, res, next) {
  const { id } = req.params;

  if (Number.isNaN(Number(id))) {
    throw new ClientError(400, 'please provide a valid post ID (number)');
  }

  if (!(id >= 1 && id <= 21474367)) {
    throw new ClientError(400, 'integer out of bounds');
  }

  const sql = `/* SQL */
    with "tag_arrays" as (
      select
        "postId",
        array_agg("tagName") as "tags"
      from "taggings"
      group by "postId"
    )

    select
      "title", "description", "username",
      "fileObjectKey", "fileThumbnailUrl",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "p"."createdAt", "tags"
    from "posts" as "p"
    join "users" using ("userId")
    left join "tag_arrays" using ("postId")
    where "postId" = $1;
  `;
  db.query(sql, [id])
    .then(({ rows: [entry] }) => {
      if (!entry) {
        throw new ClientError(404, `unable to find entry with id: ${id}`);
      }
      res.json(entry);
    })
    .catch(err => next(err));
};
