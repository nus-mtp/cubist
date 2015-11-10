import Immutable, {Map, List} from 'immutable';

export default {
  createReducer: (initialState = {}, handlers) => {
    return (state = initialState, action) => {
      let currentState = state;
      if (!Map.isMap(currentState) && !List.isList(currentState)) {
        currentState = Immutable.fromJS(currentState);
      }

      const handler = handlers[action.type];
      if (!handler) {
        return currentState;
      }

      const nextState = handler(currentState, action);
      if (!Map.isMap(nextState) && !List.isList(nextState)) {
        throw new Error('Reducers must return Immutable objects');
      }

      return nextState;
    };
  },

  startSubmitting: (state, action) => {
    return state.update('isSubmitting', (isSubmitting) => isSubmitting.set(action, true));
  },

  stopSubmitting: (state, action) => {
    return state.update('isSubmitting', (isSubmitting) => isSubmitting.delete(action));
  },

  startFetching: (state, action) => {
    return state.update('isFetching', (isFetching) => isFetching.set(action, true));
  },

  stopFetching: (state, action) => {
    return state.update('isFetching', (isFetching) => isFetching.delete(action));
  },

  hasError: (state, action, error) => {
    return state.update('err', (err) => err.set(action, error));
  },

  clearError: (state, action) => {
    return state.update('err', (err) => err.delete(action));
  },

  hasSuccess: (state, action) => {
    return state.update('isSuccess', (isSuccess) => isSuccess.set(action, true));
  },

  clearSuccess: (state, action) => {
    return state.update('isSuccess', (isSuccess) => isSuccess.delete(action));
  }
};
