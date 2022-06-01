const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3/');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  },
  region: 'us-west-1'
});

const storage = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // contentDisposition: 'attachment',
  key: (req, file, done) => {
    const fileExtension = path.extname(file.originalname);
    const key = `${req.fileName}${fileExtension}`;
    done(null, key);
  }
});

const upload = multer({
  storage
});

module.exports = upload;
