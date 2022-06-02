const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3/');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
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
  key: (req, file, done) => {
    const fileExtension = path.extname(file.originalname);
    const key = `${req.fileName}${fileExtension}`;
    done(null, key);
  }
});

const upload = multer({
  storage
});

/**
 * Download an object with a specified file name.
 * @param {string} objectKey - Key of the S3 object you want to download.
 * @param {string} fileName - Name of the resulting file.
 * @returns {string} URL to redirect user to download to.
 */
async function download(objectKey, fileName) {
  const command = new GetObjectCommand({
    Key: objectKey,
    Bucket: process.env.AWS_S3_BUCKET,
    ResponseContentDisposition: `attachment; filename=${fileName}`
  });

  const url = await getSignedUrl(s3, command);

  return url;
}

module.exports = { upload, download };
