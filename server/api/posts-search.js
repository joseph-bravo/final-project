const ClientError = require('../lib/client-error');
const db = require('../lib/db');

module.exports = function postsSearchId(req, res, next) {
  const { q: query, cols: columns } = req.query;
  if (!query) {
    throw new ClientError(
      400,
      'provide query param "q" with text you want to search for'
    );
  }
  if (!columns) {
    throw new ClientError(
      400,
      'provide query param "cols" with columns you want to search for (title, description, tags, username) separated by ,'
    );
  }
  const columnsArray = columns.split(',');
  const columnsConfig = {
    title: columnsArray.includes('title'),
    description: columnsArray.includes('description'),
    tags: columnsArray.includes('tags'),
    username: columnsArray.includes('username')
  };

  if (
    !columnsConfig.title &&
    !columnsConfig.description &&
    !columnsConfig.tags &&
    !columnsConfig.username
  ) {
    throw new ClientError(
      400,
      'provide query param "cols" with columns you want to search for (title, description, tags, username) separated by ,'
    );
  }

  // prettier-ignore
  const sql = `/* SQL */
    with "tag_arrays" as (
      select
        "postId",
        array_agg("tagName") as "tags",
        array_to_string(array_agg("tagName"), ' ') as "tagSearch"
      from "taggings"
      group by "postId"
    ), "posts_with_tags" as (
      select * from "posts"
      join "users" using ("userId")
      join "tag_arrays" using ("postId")
    ), "weighted_posts" as (
      select
        "postId",
        ${
          columnsConfig.title
            ? `/* SQL */
            setweight(to_tsvector("title"), 'A') ||`
            : ''
        }
        ${
          columnsConfig.description
            ? `/* SQL */
            setweight(to_tsvector("description"), 'B') ||`
            : ''
        }
        ${
          columnsConfig.tags
            ? `/* SQL */
            setweight(to_tsvector("tagSearch"), 'C') ||`
            : ''
        }
        ${
          columnsConfig.username
            ? `/* SQL */
            setweight(to_tsvector("username"), 'D') ||`
            : ''
        }
        ''
          as "weights"
      from "posts_with_tags"
    ), "search_ranking" as (
      select *, ts_rank("weights", plainto_tsquery($1)) as "ranks"
      from "weighted_posts"
    )

    select
      "title", "description", "username",
      "fileObjectKey", "fileThumbnailUrl",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "createdAt", "tag_arrays"."tags", "ranks"
    from "search_ranking"
    join "posts" using ("postId")
    join "users" using ("userId")
    join "tag_arrays" using ("postId")
    where "ranks" > 0.01
    order by "ranks" desc
    limit 20
    ;
  `;
  db.query(sql, [query])
    .then(reSQL => res.json(reSQL.rows))
    .catch(next);
};
