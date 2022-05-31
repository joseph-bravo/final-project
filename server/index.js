require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const errorMiddleware = require('./error-middleware');
const upload = require('./uploades-middleware');
const { randomUUID } = require('crypto');

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
    console.log(req.body);
    const { title, description, tags } = req.body;
    const sql = `/* SQL */
      insert into "files"
        ("filePath", "thumbnailPath", )
    `;
    res.json(paths);
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
