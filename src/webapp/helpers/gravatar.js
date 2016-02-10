import md5 from 'md5';

export default {
  getGravatarUrl(email) {
    return `http://www.gravatar.com/avatar/${md5(email)}?d=retro`;
  }
};
