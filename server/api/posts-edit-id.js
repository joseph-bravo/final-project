const ClientError = require('../lib/client-error');
const postSchema = require('../../shared/post-schema');
const db = require('../lib/db');

module.exports = function postsEditId(req, res, next) {
  if (req.userId === null) {
    throw new ClientError(401, 'authorization required');
  }
  const { id } = req.params;
  if (Number.isNaN(Number(id))) {
    throw new ClientError(400, 'please provide a valid post ID (number)');
  }
  if (!(id >= 1) || !(id <= 2147483647)) {
    throw new ClientError(400, 'integer out of bounds');
  }
  const {
    title: rawTitle,
    description: rawDescription,
    tags: rawTags
  } = req.body;

  if (!rawTitle || !rawDescription || !rawTags) {
    throw new ClientError(
      400,
      'title, description, and tags are required fields'
    );
  }

  const splitTags = rawTags.split(' ');

  const { title, description, tags } = postSchema.cast({
    title: rawTitle,
    description: rawDescription,
    tags: splitTags
  });

  const sql = `/* SQL */
    with "update_post" as (
      update "posts"
      set
        "title" = $1,
        "description" = $2
      where
        "postId" = $3 and
        "userId" = $5
      returning "postId", "title", "description", $4 as "new_tags"
    ), "delete_taggings" as (
      delete from "taggings" as "t"
      using "update_post" as "u"
      where "u"."postId" = "t"."postId"
    ), "upsert_tags" as (
      insert into "tags" ("tagName")
      select
        unnest("new_tags"::text[]) as "tagName"
          from "update_post"
      on conflict ("tagName")
        do nothing
    ) , "add_taggings" as (
      insert into "taggings" ("postId", "tagName")
      select
        $3,
        unnest("new_tags"::text[]) as "tagName"
          from "update_post"
      returning *
    ), "tag_arrays" as (
      select
        $3 as "postId",
        array_agg("tagName") as "tags"
      from "add_taggings"
    )

    select
      "u"."title", "u"."description", "u"."postId",
      "fileObjectKey", "fileThumbnailUrl",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "username", "posts"."userId", "posts"."postId", "posts"."createdAt", "tags"
    from "update_post" as "u"
    join "posts" using ("postId")
    join "users" using ("userId")
    join "tag_arrays" using ("postId")
  `;

  const params = [title, description, id, tags, req.userId];
  db.query(sql, params)
    .then(({ rows: [entry] }) => {
      if (!entry) {
        throw new ClientError(404, `unable to find entry with id: ${id}`);
      }
      res.json(entry);
    })
    .catch(err => next(err));
};
