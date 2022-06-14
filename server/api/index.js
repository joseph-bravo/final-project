const catalog = require('./catalog');
const upload = require('./upload');
const catalogUserId = require('./catalog-user-id');
const postsViewId = require('./posts-view-id');
const postsSearch = require('./posts-search');
const postsDownloadId = require('./posts-download-id');
const postsEditId = require('./posts-edit-id');
const authSignUp = require('./auth-sign-up');
const authSignIn = require('./auth-sign-in');

module.exports = {
  catalog,
  catalogUserId,
  upload,
  posts: {
    viewId: postsViewId,
    search: postsSearch,
    downloadId: postsDownloadId,
    editId: postsEditId
  },
  auth: {
    signup: authSignUp,
    signin: authSignIn
  }
};
