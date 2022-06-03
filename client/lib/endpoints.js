/**
 * Generate URL to download from `/api/posts/download` endpoint.
 * @param {Number} postId - ID of the post to download.
 * @returns {String} URL to download. Set this as href of download link.
 */
export function apiDownloadPostFromId(postId) {
  return `/api/posts/download/${postId}`;
}

export function urlPostFromId(postId) {
  return `/posts/${postId}`;
}

export function apiViewPostFromId(postId) {
  return `/api/posts/view/${postId}`;
}
