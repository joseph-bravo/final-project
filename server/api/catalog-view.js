const db = require('../lib/db');
module.exports = function catalog(req, res, next) {
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
    order by "p"."createdAt" desc;
  `;
  db.query(sql)
    .then(reSQL => {
      res.json(reSQL.rows);
    })
    .catch(err => next(err));
};
