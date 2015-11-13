import { expect } from 'chai';
import actions from 'webapp/actions/RenderActions';
import { WIREFRAME_TOGGLE, AUTO_ROTATE_TOGGLE, SHADING_TOGGLE } from 'webapp/actions/types';

describe('Render Actions', () => {
  it('Should create an action to toggle showing wireframe', () => {
    expect(actions.toggleWireframe()).to.deep.equal({ type: WIREFRAME_TOGGLE });
  });

  it('Should create an action to toggle shading mode', () => {
    expect(actions.toggleShading()).to.deep.equal({ type: SHADING_TOGGLE });
  });

  it('Should create an action to toggle auto-rotation', () => {
    expect(actions.toggleAutoRotate()).to.deep.equal({ type: AUTO_ROTATE_TOGGLE });
  });
});
