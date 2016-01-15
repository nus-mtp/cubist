import createLogger from 'redux-logger';
import Immutable from 'immutable';

/**
 * Logger middleware to log each action and state of the store before & after
 */
export default createLogger({
  collapsed: true,
  // Conditions to use logger
  predicate: () => process.env.NODE_ENV === 'development',
  // Transform the state of the store before using the middleware
  stateTransformer: (state) => {
    const newState = {};
    // Convert a substore if it is an Immutable object
    for (const i of Object.keys(state)) {
      if (Immutable.Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }

    return newState;
  }
});
