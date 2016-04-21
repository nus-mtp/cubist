import { expect } from 'chai';
import actions from 'webapp/actions/CameraActions';
import { CAMERA_ORBIT, CAMERA_UPDATE, CAMERA_SET_VIEW } from 'webapp/actions/types';

describe('Camera Actions', () => {
  it('Should create an action to toggle orbit camera', () => {
    expect(actions.orbitCamera('foo')).to.deep.equal({ type: CAMERA_ORBIT, payload: 'foo' });
  });

  it('Should create an action to return camera object to camera', () => {
    expect(actions.updateCamera('foo')).to.deep.equal({ type: CAMERA_UPDATE, payload: 'foo' });
  });

  it('Should create an action to notify success of snapshot taking with token and data', () => {
    expect(actions.setCameraView('foo', 'boo')).to.deep.equal({ type: CAMERA_SET_VIEW, payload: { position: 'foo', lookAt: 'boo' }});
  });
});

