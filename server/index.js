require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const errorMiddleware = require('./error-middleware');
const upload = require('./uploader-middleware');
const { randomUUID } = require('crypto');

const app = express();
const publicPath = path.join(__dirname, 'public');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));

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
      description,
      tags: rawTags,
      filePropsSound,
      filePropsLayerCount,
      filePropsName
    } = req.body;

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
    db
      .query(sql, params)
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
