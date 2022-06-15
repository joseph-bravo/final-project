const ClientError = require('../lib/client-error');
const db = require('../lib/db');

module.exports = function catalogUserId(req, res, next) {
  const { id } = req.params;
  if (Number.isNaN(Number(id))) {
    throw new ClientError(400, 'please provide a valid post ID (number)');
  }
  if (!(id >= 1) || !(id <= 2147483647)) {
    throw new ClientError(400, 'integer out of bounds');
  }
  const sql = `/* SQL */
    with "tag_arrays" as (
      select
        "postId",
        array_agg("tagName") as "tags"
      from "taggings"
      group by "postId"
    ), "formatted_posts" as (
      select
        "title", "description", "username",
        "fileObjectKey", "fileThumbnailUrl",
        "filePropsName", "filePropsSound", "filePropsLayerCount",
        "postId", "userId", "p"."createdAt", "tags"
      from "posts" as "p"
      join "users" using ("userId")
      left join "tag_arrays" using ("postId")
      order by "p"."createdAt" desc
    ), "jsonify" as (
      select json_agg("formatted_posts".*), "users"."userId"
      from "users"
      join "formatted_posts" using ("userId")
      group by "users"."userId"
    )

    select
      "username",
      "userId",
      "jsonify"."json_agg" as "posts"
    from "users"
    left join "jsonify" using ("userId")
    where "userId" = $1;
  `;
  db.query(sql, [id])
    .then(({ rows: [user] }) => {
      if (!user) {
        throw new ClientError(404, `unable to find user with id: ${id}`);
      }
      res.json(user);
    })
    .catch(err => next(err));
};
