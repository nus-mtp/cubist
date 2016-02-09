import { expect } from 'chai';
import actions from 'webapp/actions/SnapshotActions';
import { SNAPSHOT_TRIGGER, SNAPSHOT_SUCCESS } from 'webapp/actions/types';

describe('Snapshot Actions', () => {
  it('Should create an action to trigger snapshot with given token', () => {
    expect(actions.triggerSnapshot('foo')).to.deep.equal({ type: SNAPSHOT_TRIGGER, payload: 'foo' });
  });

  it('Should create an action to notify success of snapshot taking with token and data', () => {
    expect(actions.snapshotSuccess('foo', 'bar')).to.deep.equal(
      { type: SNAPSHOT_SUCCESS, payload: { token: 'foo', data: 'bar' } }
    );
  });
});
