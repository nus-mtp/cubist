import { expect } from 'chai';
import { Map } from 'immutable';

import reducer from 'webapp/reducers/RenderReducer';
import { WIREFRAME_TOGGLE, AUTO_ROTATE_TOGGLE, SHADING_TOGGLE } from 'webapp/actions/types';

describe('Render Reducer', () => {
  it('Should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(Map({
      wireframe: false,
      shadingMode: 0,
      autoRotate: false,
      resetViewToggle: false,
      playbackWalkthroughToggle: false
    }));
  });

  describe('#Action: WIREFRAME_TOGGLE', () => {
    it('Should handle WIREFRAME_TOGGLE toggling from TRUE to FALSE', () => {
      expect(
        reducer(Map({ wireframe: true }), { type: WIREFRAME_TOGGLE })
      ).to.equal(
        Map({ wireframe: false })
      );
    });

    it('Should handle WIREFRAME_TOGGLE toggling from FALSE to TRUE', () => {
      expect(
        reducer(Map({ wireframe: false }), { type: WIREFRAME_TOGGLE })
      ).to.equal(
        Map({ wireframe: true })
      );
    });
  });

  describe('#Action: SHADING_TOGGLE', () => {
    it('Should handle SHADING_TOGGLE by incrementing shading type', () => {
      expect(
        reducer(Map({ shadingMode: 0 }), { type: SHADING_TOGGLE })
      ).to.equal(
        Map({ shadingMode: 1 })
      );

      expect(
        reducer(Map({ shadingMode: 1 }), { type: SHADING_TOGGLE })
      ).to.equal(
        Map({ shadingMode: 2 })
      );

      expect(
        reducer(Map({ shadingMode: 2 }), { type: SHADING_TOGGLE })
      ).to.equal(
        Map({ shadingMode: 3 })
      );

      expect(
        reducer(Map({ shadingMode: 3 }), { type: SHADING_TOGGLE })
      ).to.equal(
        Map({ shadingMode: 0 })
      );
    });
  });

  describe('#Action: AUTO_ROTATE_TOGGLE', () => {
    it('Should handle AUTO_ROTATE_TOGGLE toggling from TRUE to FALSE', () => {
      expect(
        reducer(Map({ autoRotate: true }), { type: AUTO_ROTATE_TOGGLE })
      ).to.equal(
        Map({ autoRotate: false })
      );
    });

    it('Should handle AUTO_ROTATE_TOGGLE toggling from FALSE to TRUE', () => {
      expect(
        reducer(Map({ autoRotate: false }), { type: AUTO_ROTATE_TOGGLE })
      ).to.equal(
        Map({ autoRotate: true })
      );
    });
  });
});
