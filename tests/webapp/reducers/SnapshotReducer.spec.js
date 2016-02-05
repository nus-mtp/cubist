import { expect } from 'chai';
import { Map } from 'immutable';

import reducer from 'webapp/reducers/SnapshotReducer';
import { SNAPSHOT_TRIGGER, SNAPSHOT_SUCCESS } from 'webapp/actions/types';

describe('Snapshot Reducer', () => {
  it('Should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(Map({
      snapshotToken: undefined,
		snapshots: new Map()
    }));
  });

  describe('#Action: SNAPSHOT_TRIGGER', () => {
    it('Should store token on SNAPSHOT_TRIGGER', () => {
      expect(
        reducer(Map({ snapshotToken: "foo" }), { type: SNAPSHOT_TRIGGER, payload: "bar" })
      ).to.equal(
        Map({ snapshotToken: "bar" })
      );
    });
  });

  describe('#Action: SNAPSHOT_SUCCESS', () => {
    it('Should store new mapping of token to data on SNAPSHOT_SUCCESS', () => {
      expect(
        reducer(Map({ snapshots: new Map() }), { type: SNAPSHOT_SUCCESS, payload: { token: "foo", data: "bar" } })
      ).to.equal(
        Map({ snapshots: Map({ foo: "bar"}) })
      );
    });
  });
});
