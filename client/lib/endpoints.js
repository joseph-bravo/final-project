/**
 * Generate URL to download from `/api/posts/download` endpoint.
 * @param {Number} postId - ID of the post to download.
 * @returns {String} URL to download. Set this as href of download link.
 */
export function urlDownloadFromId(postId) {
  return `/api/posts/download?id=${postId}`;
}
