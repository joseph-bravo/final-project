require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const argon2 = require('argon2');
const errorMiddleware = require('./error-middleware');
const { upload, download } = require('./s3-middleware');
const ClientError = require('./client-error');
const middlewareGenUUID = require('./uuid-to-req-middleware');

const app = express();
const publicPath = path.join(__dirname, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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

app.use(express.json());

/**
 * ? Get all post data.
 */
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
      "fileObjectKey", "previewImagePath",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "p"."createdAt", "tags"
    from "posts" as "p"
    join "files" using ("fileId")
    join "users" using ("userId")
    join "tag_arrays" using ("postId")
    order by "p"."createdAt" desc;
  `;
  db.query(sql).then(reSQL => {
    res.json(reSQL.rows);
  });
});

/**
 * ? Get post data limited with a limit to 20, provided the offset
 */
app.get('/api/catalog/:offset', (req, res, next) => {
  const { offset } = req.params;
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
      "fileObjectKey", "previewImagePath",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "p"."createdAt", "tags"
    from "posts" as "p"
    join "files" using ("fileId")
    join "users" using ("userId")
    join "tag_arrays" using ("postId")
    order by "p"."createdAt"
    limit 20
    offset $1;
  `;
  db.query(sql, [offset]).then(reSQL => {
    res.json(reSQL.rows);
  });
});

/**
 * ? Queries DB for single post and its details, like /api/catalog/ but single.
 */
app.get('/api/posts/view/:id', (req, res, next) => {
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
    )

    select
      "title", "description", "username",
      "fileObjectKey", "previewImagePath",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "p"."createdAt", "tags"
    from "posts" as "p"
    join "files" using ("fileId")
    join "users" using ("userId")
    join "tag_arrays" using ("postId")
    where "postId" = $1;
  `;
  db.query(sql, [id])
    .then(({ rows }) => {
      if (!rows[0]) {
        throw new ClientError(404, `unable to find entry with id: ${id}`);
      }
      res.json(rows);
    })
    .catch(err => next(err));
});

/**
 * ? Searches DB for posts matching the query details.
 * @QueryParameter q - text of the search query.
 * @QueryParameter cols - columns to apply search to.
 */
app.get('/api/posts/search', (req, res, next) => {
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
      "fileObjectKey", "previewImagePath",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "posts"."createdAt", "tag_arrays"."tags", "ranks"
    from "search_ranking"
    join "posts" using ("postId")
    join "files" using ("fileId")
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
});

/**
 * ? Redirects to a download of the SAR file given the ID of post.
 */
app.get('/api/posts/download/:id', (req, res, next) => {
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
    join "files" using ("fileId")
    where
      "postId" = $1;
  `;
  // prettier-ignore
  db.query(sql, [id])
    .then(reSQL => {
      if (!reSQL.rows) {
        res.status(404).json({ error: `unable to find entry with id: ${id}` });
      }
      const [{ fileObjectKey, title }] = reSQL.rows;
      download(fileObjectKey, `${title}.sar`).then(downloadURL => {
        res.redirect(downloadURL);
      });
    });
});

/**
 * ? Handle uploads from forms on the path '/api/upload'
 */
app.post(
  '/api/upload',
  middlewareGenUUID,
  upload.fields([
    { name: 'sar', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  (req, res, next) => {
    const { sar, thumbnail } = req.files;

    const paths = {
      sar: sar[0].key,
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
      insert into "files" ("fileObjectKey", "previewImagePath", "filePropsSound", "filePropsName", "filePropsLayerCount")
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

/**
 * ? Handle auth signup
 * @JSONBody - username: string. password: string
 */
app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  const hashedPassword = argon2.hash(password);
  const sql = `/* SQL */
    insert into "users" ("username", "hashedPassword")
    values ($1, $2)
    on conflict ("username")
    do nothing
    returning "userId", "username"
    ;
  `;
  db.query(sql, [username, hashedPassword])
    .then(reSQL => {
      const {
        rows: [newUser]
      } = reSQL;
      if (!newUser) {
        res.sendStatus(409);
        return;
      }
      const { username, userId } = newUser;
      res.status(201).json({ username, userId });
    })
    .catch(err => next(err));
});

app.get('/posts/:id', (req, res, next) => {
  const { id } = req.params;
  if (!(id >= 1) || !(id <= 2147483647)) {
    res.render('index');
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
      "fileObjectKey", "previewImagePath",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "p"."createdAt", "tags"
    from "posts" as "p"
    join "files" using ("fileId")
    join "users" using ("userId")
    join "tag_arrays" using ("postId")
    where "postId" = $1;
  `;
  db.query(sql, [id])
    .then(({ rows: [post] }) => {
      if (!post) {
        next();
        return;
      }
      const { title, description, previewImagePath: image } = post;
      res.render('index', {
        title,
        description,
        image
      });
    })
    .catch(err => next(err));
});

app.use((req, res) => {
  res.render('index');
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
