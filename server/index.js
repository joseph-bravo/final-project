require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const errorMiddleware = require('./error-middleware');
const { upload, download } = require('./uploader-middleware');
const { randomUUID } = require('crypto');
const ClientError = require('./client-error');

const app = express();
const publicPath = path.join(__dirname, 'public');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));

app.get('/api/catalog', (req, res, next) => {
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
      "file", "thumbnailPath",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "p"."createdAt"
    from "posts" as "p"
    join "files" using ("fileId")
    join "users" using ("userId")
    join "tag_arrays" using ("postId")
    order by "p"."createdAt"
  `;
  db.query(sql).then(posts => {
    res.json(posts);
  });
});

/**
 * ? Handles downloads of SAR files given the ID of post.
 */
app.get('/api/post/:id/download', (req, res, next) => {
  const { id } = req.params;
  if (Number.isNaN(Number(id))) {
    throw new ClientError(400, 'please provide a valid post ID (number)');
  }
  download().then(downloadURL => {
    res.redirect(downloadURL);
  });
});

/**
 * ? Handle uploads from forms on the path '/api/upload'
 */
app.post(
  '/api/upload',
  (req, res, next) => {
    req.fileName = randomUUID();
    next();
  },
  upload.fields([
    { name: 'sar', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  (req, res, next) => {
    const { sar, thumbnail } = req.files;
    const paths = {
      sar: sar[0].location,
      thumbnail: thumbnail[0].location
    };

    const {
      title,
      tags: rawTags,
      filePropsSound,
      filePropsLayerCount,
      filePropsName
    } = req.body;

    let { description } = req.body;
    if (!req.body.description) {
      description = '';
    }

    const tags = rawTags.split(',').map(e => e.trim());

    const sql = `/* SQL */
      with "new_file" as (
      insert into "files" ("filePath", "thumbnailPath", "filePropsSound", "filePropsName", "filePropsLayerCount")
          values ($1, $2, $3, $4, $5)
        returning
          *
      ), "new_post" as (
      insert into "posts" ("fileId", "userId", "title", "description")
        select
          "fileId",
          1,
          $6,
          $7
        from
          "new_file"
        returning
          *
      ),
      "upsert_tags" as (
      insert into "tags" ("tagName")
        select
          *
        from
          unnest($8::text[])
        on conflict ("tagName")
          do nothing
      ),
      "add_taggings" as (
      insert into "taggings" ("postId", "tagName")
        select
          "postId",
          unnest($8::text[]) as "tagName"
        from
          "new_post"
        returning
          *
      )
      select
        *
      from
        "new_post"
        join "new_file" using ("fileId")
    `;

    const params = [
      paths.sar,
      paths.thumbnail,
      filePropsSound,
      filePropsName,
      filePropsLayerCount,
      title,
      description,
      tags
    ];
    // prettier-ignore
    db.query(sql, params)
      .then(reSQL => {
        res.json(reSQL);
      });
  }
);

app.use((req, res) => {
  res.sendFile('/index.html', {
    root: path.join(__dirname, 'public')
  });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
