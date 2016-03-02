const alphaNumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default {
  randomToken(numChars = 8) {
    return Array
      .apply(null, Array(numChars))
      .map(() => alphaNumericChars.charAt(Math.floor(Math.random() * alphaNumericChars.length)))
      .join('');
  },
  isImagePath(str) {
    return str.match(/\.(gif|jpe?g|png|woff|woff2|eot|ttf|otf|svg)$/);
  }
};
