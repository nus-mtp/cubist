import keymirror from 'keymirror';

/**
 * Action Type Helper
 */
export default {
  combineTypes(syncType, promiseTypes) {
    return keymirror({ ...syncType, ...promiseTypes });
  }
};
