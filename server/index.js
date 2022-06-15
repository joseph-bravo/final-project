require('dotenv/config');
const path = require('path');
const express = require('express');
const api = require('./api');
const {
  errorMiddleware,
  authMiddleware,
  s3Middleware: { upload },
  devMiddleware
} = require('./middlewares');
const db = require('./lib/db');
const app = express();
const publicPath = path.join(__dirname, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {
  app.use(devMiddleware(publicPath));
}

app.use(express.static(publicPath));

app.use(express.json());

// ? Get all post data.
app.get('/api/catalog', api.catalog.view);

// ? Get all post data from a certain user.
app.get('/api/catalog/user/:id', api.catalog.userId);

// ? Searches DB for posts matching the query details.
/** Parameters:
 * @QueryParameter q - text of the search query.
 * @QueryParameter cols - columns to apply search to.
 */
app.get('/api/catalog/search', api.catalog.search);

// ? Queries DB for single post and its details.
app.get('/api/posts/view/:id', api.posts.viewId);

// ? Redirects to a download of the SAR file given the ID of post.
app.get('/api/posts/download/:id', api.posts.downloadId);

// ? AUTHORIZED - Handle new posts.
// prettier-ignore
app.post('/api/upload', authMiddleware,
  upload.fields([
    { name: 'sar', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  api.upload
);

// ? AUTHORIZED - Handle post (id) edits with JSON passed as new text to change.
/**
 * @JSONBody - title: string, description: string, array: string[]
 */
app.put('/api/posts/edit/:id', authMiddleware, api.posts.editId);

// ? Handle creation of new accounts.
/**
 * @JSONBody - username: string. password: string
 */
app.post('/api/auth/sign-up', api.auth.signup);

// ? Handle logging into accounts (JSON Web Token Provider)./
/**
 * @JSONBody - username: string. password: string
 */
app.post('/api/auth/sign-in', api.auth.signin);

// ? Render page provided post ID.
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
      "fileObjectKey", "fileThumbnailUrl",
      "filePropsName", "filePropsSound", "filePropsLayerCount",
      "postId", "userId", "p"."createdAt", "tags"
    from "posts" as "p"
    join "tag_arrays" using ("postId")
    join "users" using ("userId")
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

// ? Render index if request doesn't match all the other routes.
app.use((req, res) => {
  res.render('index');
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
