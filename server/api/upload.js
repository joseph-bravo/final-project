const postSchema = require('../../shared/post-schema');
const db = require('../lib/db');

module.exports = function upload(req, res, next) {
  // * Anonymous post check
  req.userId ??= 1;

  const { sar, thumbnail } = req.files;

  const paths = {
    sar: sar[0].key,
    thumbnail: thumbnail[0].location
  };

  const {
    title: rawTitle,
    description: rawDescription,
    tags: rawTags,
    filePropsSound,
    filePropsLayerCount,
    filePropsName
  } = req.body;

  const splitTags = rawTags.split(' ');

  const { title, description, tags } = postSchema.cast({
    title: rawTitle,
    description: rawDescription,
    tags: splitTags
  });

  const sql = `/* SQL */
      with "new_post" as (
        insert into "posts" 
          ( "userId", "title", "description", 
          "fileObjectKey", "fileThumbnailUrl",
          "filePropsSound", "filePropsName", "filePropsLayerCount")
        select
          $1, $2, $3, $4, $5, $6, $7, $8
        returning *
      ), "upsert_tags" as (
        insert into "tags" ("tagName")
        select
          *
        from
          unnest($9::text[])
        on conflict ("tagName")
          do nothing
      ), "add_taggings" as (
      insert into "taggings" 
        ("postId", "tagName")
      select
        "postId",
        unnest($9::text[]) as "tagName"
      from "new_post"
      returning *
      )
      select *
      from "new_post"
    `;

  const params = [
    req.userId,
    title,
    description,
    paths.sar,
    paths.thumbnail,
    filePropsSound,
    filePropsName,
    filePropsLayerCount,
    tags
  ];
  // prettier-ignore
  db.query(sql, params)
    .then(reSQL => {
      res.json(reSQL);
    })
    .catch(err => next(err));
};
