import validator from 'validator';

const fallbackSnapshotUrl = 'https://d13yacurqjgara.cloudfront.net/users/532989/screenshots/1700135/cube_1x.jpg';

export default {
  getSnapshotUrl(url) {
    if (!url) {
      return fallbackSnapshotUrl;
    }
    if (validator.isURL(url)) {
      return url;
    }

    return `/storage/snapshots/${url}`;
  },
  getBase64ImageUrl(base64data) {
    return `data:image/png;base64,${base64data}`;
  }
};
