import validator from 'validator';

export default {
  getSnapshotUrl(url) {
    if (validator.isURL(url)) {
      return url;
    }

    return `/storage/snapshots/${url}`;
  }
};
