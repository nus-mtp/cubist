export default {
  randomToken() {
    return Math.random().toString(36).substr(2);
  },
  isImagePath(str) {
    return str.match(/\.(gif|jpe?g|png|woff|woff2|eot|ttf|otf|svg)$/);
  }
};
