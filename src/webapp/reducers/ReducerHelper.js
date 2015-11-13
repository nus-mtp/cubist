import Immutable, { Map, List } from 'immutable';

export default {
  createReducer: (initialState = {}, handlers = {}) => {
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
  }
};
