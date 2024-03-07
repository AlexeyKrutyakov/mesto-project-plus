const REGEXP = {
  avatar:
    /https?:\/\/(www\.)?(?!www)([a-z0-9-.]*)?[a-z0-9-]*\.[a-z-]{2,}(\/)?([a-z0-9-./_]*)?/gi,
  email: /[a-z0-9-.]{2,}@[a-z0-9-.]*[a-z0-9-]{2,}/gi,
};

export default REGEXP;
