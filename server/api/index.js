const catalogView = require('./catalog-view');
const upload = require('./upload');
const catalogUserId = require('./catalog-user-id');
const postsViewId = require('./posts-view-id');
const postsDownloadId = require('./posts-download-id');
const postsEditId = require('./posts-edit-id');
const authSignUp = require('./auth-sign-up');
const authSignIn = require('./auth-sign-in');
const catalogSearch = require('./catalog-search');

module.exports = {
  catalog: {
    view: catalogView,
    userId: catalogUserId,
    search: catalogSearch
  },
  upload,
  posts: {
    viewId: postsViewId,
    downloadId: postsDownloadId,
    editId: postsEditId
  },
  auth: {
    signup: authSignUp,
    signin: authSignIn
  }
};
