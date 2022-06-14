require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const kebabCase = require('lodash/kebabCase');
const errorMiddleware = require('./lib/error-middleware');
const { upload, download } = require('./lib/s3-middleware');
const ClientError = require('./lib/client-error');
const authMiddleware = require('./lib/auth-middleware');
const postSchema = require('../shared/post-schema');

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
  app.use(require('./lib/dev-middleware')(publicPath));
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
    join "files" using ("postId")
    join "users" using ("userId")
    left join "tag_arrays" using ("postId")
    order by "p"."createdAt" desc;
  `;
  db.query(sql).then(reSQL => {
    res.json(reSQL.rows);
  });
});

/**
 * ? Queries DB for catalog but limits to userId param
 */
app.get('/api/catalog/user/:userId', (req, res, next) => {
  const { userId } = req.params;
  if (Number.isNaN(Number(userId))) {
    throw new ClientError(400, 'please provide a valid post ID (number)');
  }
  if (!(userId >= 1) || !(userId <= 2147483647)) {
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
        "fileObjectKey", "previewImagePath",
        "filePropsName", "filePropsSound", "filePropsLayerCount",
        "postId", "userId", "p"."createdAt", "tags"
      from "posts" as "p"
      join "files" using ("postId")
      join "users" using ("userId")
      join "tag_arrays" using ("postId")
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
  db.query(sql, [userId])
    .then(({ rows: [user] }) => {
      if (!user) {
        throw new ClientError(404, `unable to find user with id: ${userId}`);
      }
      res.json(user);
    })
    .catch(err => next(err));
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
    join "files" using ("postId")
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
    join "files" using ("postId")
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
    join "files" using ("postId")
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
      download(fileObjectKey, `${kebabCase(title)}.sar`).then(downloadURL => {
        res.redirect(downloadURL);
      });
    });
});

/**
 * ? Handle uploads from forms on the path '/api/upload'
 */
app.post(
  '/api/upload',
  authMiddleware,
  upload.fields([
    { name: 'sar', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  (req, res, next) => {
    // * Anonymous post check
    if (req.userId === null) {
      req.userId = 1;
    }

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
        insert into "posts" ("userId", "title", "description")
          select
            $6,
            $7,
            $8
          returning
            *
      ), "new_file" as (
        insert into "files" ("postId", "fileObjectKey", "previewImagePath", "filePropsSound", "filePropsName", "filePropsLayerCount")
          select "postId", $1, $2, $3, $4, $5
          from "new_post"
        returning
          *
      ),
      "upsert_tags" as (
      insert into "tags" ("tagName")
        select
          *
        from
          unnest($9::text[])
        on conflict ("tagName")
          do nothing
      ),
      "add_taggings" as (
      insert into "taggings" ("postId", "tagName")
        select
          "postId",
          unnest($9::text[]) as "tagName"
        from
          "new_post"
        returning
          *
      )
      select
        *
      from
        "new_post"
        join "new_file" using ("postId")
    `;

    const params = [
      paths.sar,
      paths.thumbnail,
      filePropsSound,
      filePropsName,
      filePropsLayerCount,
      req.userId,
      title,
      description,
      tags
    ];
    // prettier-ignore
    db.query(sql, params)
      .then(reSQL => {
        res.json(reSQL);
      })
      .catch(err => next(err));
  }
);

/**
 * ? Handle post (id) edits with JSON passed as new text to change.
 * @JSONBody - title: string, description: string, array: string[]
 */
app.put('/api/posts/edit/:id', authMiddleware, (req, res, next) => {
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
      "files"."fileObjectKey", "files"."previewImagePath",
      "files"."filePropsName", "files"."filePropsSound", "files"."filePropsLayerCount",
      "username", "posts"."userId", "posts"."postId", "posts"."createdAt", "tags"
    from "update_post" as "u"
    join "posts" using ("postId")
    join "users" using ("userId")
    join "files" using ("postId")
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
});

/**
 * ? Handle auth signup
 * @JSONBody - username: string. password: string
 */
app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `/* SQL */
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        on conflict ("username")
        do nothing
        returning "userId", "username"
        ;
      `;
      return db.query(sql, [username, hashedPassword]);
    })
    .then(reSQL => {
      const {
        rows: [newUser]
      } = reSQL;
      if (!newUser) {
        throw new ClientError(409, 'username already taken');
      }
      const { username, userId } = newUser;
      res.status(201).json({ username, userId });
    })
    .catch(err => next(err));
});

/**
 * ? Handle auth signin
 * @JSONBody - username: string. password: string
 */
app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  const sql = `/* SQL */
    select *
    from "users"
    where "username" = $1;
  `;
  db.query(sql, [username])
    .then(reSQL => {
      const {
        rows: [user]
      } = reSQL;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { hashedPassword, userId, username } = user;
      return Promise.all([
        { userId, username },
        argon2.verify(hashedPassword, password)
      ]);
    })
    .then(([payload, isVerified]) => {
      if (!isVerified) {
        throw new ClientError(401, 'invalid login');
      }
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.json({ token, user: payload });
    })
    .catch(err => next(err));
});

/**
 * ? Render page for route /posts/:id
 */
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
    join "files" using ("postId")
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
