import keymirror from 'keymirror';

/**
 * Action Type Helper
 */
export default {
  combineTypes: function(syncType, promiseTypes) {
    return keymirror({...syncType, ...promiseTypes});
  }
};
