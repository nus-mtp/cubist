import { expect } from 'chai';
import Immutable from 'immutable';
import { Map } from 'immutable';

import reducer from 'webapp/reducers/CameraReducer';
import {
  CAMERA_ORBIT,
  CAMERA_UPDATE,
  CAMERA_SET_VIEW
} from 'webapp/actions/types';

describe('Camera Reducer', () => {
  it('Should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(Map({
      position: new Immutable.Map({ x: 0, y: 450, z: 450 }),
      up: new Immutable.Map({ x: 0, y: 1, z: 0 }),
      lookAt: new Immutable.Map({ x: 0, y: 0, z: 0 }),
      quaternion: new Immutable.Map({ x: 0, y: 0, z: 0, w: 0 }),
      trigger: false
    }));
  });

  describe('#Action: CAMERA_ORBIT', () => {
    it('Should merge in the camera properties', () => {
      const camera = {
        position: new Immutable.Map({ x: 10, y: 10, z: 10 })
      };

      expect(reducer({}, { type: CAMERA_ORBIT, payload: camera })).to.equal(Map({
        position: new Immutable.Map({ x: 10, y: 10, z: 10 })
      }));
    });
  });

  describe('#Action: CAMERA_UPDATE', () => {
    it('Should store position, up, lookAt and quaternion from the payload', () => {
      const payload = {
        position: new Immutable.Map({ x: 10, y: 10, z: 10 }),
        up: new Immutable.Map({ x: 0, y: 0, z: 1 }),
        lookAt: new Immutable.Map({ x: 0, y: 1, z: 0 }),
        quaternion: new Immutable.Map({ x: 1, y: 1, z: 1, w: 1 })
      };

      expect(reducer({}, { type: CAMERA_UPDATE, payload })).to.equal(Map({
        position: new Immutable.Map({ x: 10, y: 10, z: 10 }),
        up: new Immutable.Map({ x: 0, y: 0, z: 1 }),
        lookAt: new Immutable.Map({ x: 0, y: 1, z: 0 }),
        quaternion: new Immutable.Map({ x: 1, y: 1, z: 1, w: 1 })
      }));
    });
  });

  describe('#Action: CAMERA_SET_VIEW', () => {
    it('Should store position, and lookAt from the payload, and toggle trigger', () => {
      const payload = {
        position: new Immutable.Map({ x: 10, y: 10, z: 10 }),
        lookAt: new Immutable.Map({ x: 0, y: 1, z: 0 })
      };

      expect(reducer({ trigger: false }, { type: CAMERA_SET_VIEW, payload })).to.equal(Map({
        position: new Immutable.Map({ x: 10, y: 10, z: 10 }),
        lookAt: new Immutable.Map({ x: 0, y: 1, z: 0 }),
        trigger: true
      }));

      expect(reducer({ trigger: true }, { type: CAMERA_SET_VIEW, payload })).to.equal(Map({
        position: new Immutable.Map({ x: 10, y: 10, z: 10 }),
        lookAt: new Immutable.Map({ x: 0, y: 1, z: 0 }),
        trigger: false
      }));
    });
  });
});
