// src/utils/fixMediaUrl.js

export const fixMediaUrl = (url) => {
  if (!url) return url;

  return url.replace(
    "http://66.116.207.88/media/",
    "http://66.116.207.88:2203/media/"
  );
};