import shallowEqual from 'react-pure-render/shallowEqual';

export default function compareLocations(locA, locB) {
  return shallowEqual(locA.pathname, locB.pathname)
    && shallowEqual(locA.search, locB.search);
};
