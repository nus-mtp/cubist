import keymirror from 'keymirror';

export default {
  combineTypes: (syncType, promiseTypes) => {
    return keymirror({...syncType, ...promiseTypes});
  }
};
