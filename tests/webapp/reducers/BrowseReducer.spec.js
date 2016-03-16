import { expect } from 'chai';
import Immutable from 'immutable';
import { Map } from 'immutable';
import { Constants } from 'common';

import reducer from 'webapp/reducers/BrowseReducer';
import {
  REQ_GET_BROWSE_RESULTS
} from 'webapp/actions/types';

describe('Browse Reducer', () => {
  it('Should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(Map({
      resultsModels: new Immutable.List(),
      hasNextPage: false
    }));
  });


  it('Should put results into list assuming server responded successfully', () => {
    expect(
      reducer(Map({
        resultsModels: new Immutable.List(),
        hasNextPage: false }),
        {
          type: REQ_GET_BROWSE_RESULTS,
          promiseState: Constants.PROMISE_STATE_SUCCESS,
          res: {
            body: ['foo', 'bar']
          }
        })
    ).to.equal(
      Map({
        resultsModels: new Immutable.List(['foo', 'bar']),
        hasNextPage: false
      })
    );
  });

  it('Should create correct results list and indicate there is a next page'
    + 'if there are more than 21 results', () => {
    const expectedArr = [];
    const givenArr = [];

    for (let i = 0; i < 21; i++) {
      givenArr.push(i);
      if (i < 20) {
        expectedArr.push(i);
      }
    }

    expect(
      reducer(Map({
        resultsModels: new Immutable.List(),
        hasNextPage: false }),
        {
          type: REQ_GET_BROWSE_RESULTS,
          promiseState: Constants.PROMISE_STATE_SUCCESS,
          res: {
            body: givenArr
          }
        })
    ).to.equal(
      Map({
        resultsModels: new Immutable.List(expectedArr),
        hasNextPage: true
      })
    );
  });
});
