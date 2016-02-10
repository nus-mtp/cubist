import { expect } from 'chai';
import { List, Map } from 'immutable';

import ReducerHelper from 'webapp/reducers/ReducerHelper';

describe('Reducer Helper', () => {
  describe('#createReducer', () => {
    it('Should create a reducer function', () => {
      expect(ReducerHelper.createReducer()).is.a('function');
    });

    it('Should create a reducer converting normal state to `Immutable` state', () => {
      const reducer = ReducerHelper.createReducer();
      expect(Map.isMap(reducer({}, {}))).is.true;
      expect(List.isList(reducer([], {}))).is.true;
    });

    it('Should create a reducer return the current state if there is no corresponding handlers', () => {
      const reducer = ReducerHelper.createReducer();
      expect(reducer(Map({ foo: 'bar' }), {})).to.equal(Map({ foo: 'bar' }));
    });

    it('Should create a reducer map the current state to the next Immutable state', () => {
      const action = {
        type: 'TEST_ACTION'
      };
      const reducer = ReducerHelper.createReducer({}, {
        TEST_ACTION: () => {
          return Map({ foo: 'bar2' });
        }
      });
      expect(reducer(Map({ foo: 'bar' }), action)).to.equal(Map({ foo: 'bar2' }));
    });

    it('Should throw error if the next state is not `Immutable` state', () => {
      const reducer = ReducerHelper.createReducer({}, {
        TEST_ACTION_1: () => {
          return { foo: 'bar' };
        },
        TEST_ACTION_2: () => {
          return ['foo', 'bar'];
        }
      });
      expect(() => reducer(Map({ foo: 'bar' }), { type: 'TEST_ACTION_1' })).to.throw(Error);
      expect(() => reducer(Map({ foo: 'bar' }), { type: 'TEST_ACTION_2' })).to.throw(Error);
    });
  });
});
