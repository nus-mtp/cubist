import { expect } from 'chai';
import actions from 'webapp/actions/RenderActions';
import {
  WIREFRAME_TOGGLE,
  AUTO_ROTATE_TOGGLE,
  SHADING_TOGGLE,
  RESET_BUTTONS,
  RESET_VIEW_TOGGLE,
  PLAY_WALKTHROUGH,
  TEXTURE_TOGGLE
} from 'webapp/actions/types';

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

  it('Should create an action to reset buttons', () => {
    expect(actions.resetButtons()).to.deep.equal({ type: RESET_BUTTONS });
  });

  it('Should create an action to reset view', () => {
    expect(actions.toggleResetView()).to.deep.equal({ type: RESET_VIEW_TOGGLE });
  });

  it('Should create an action to toggle walkthrough', () => {
    expect(actions.togglePlaybackWalkthrough()).to.deep.equal({ type: PLAY_WALKTHROUGH });
  });

  it('Should create an action to toggle texture', () => {
    expect(actions.toggleTexture()).to.deep.equal({ type: TEXTURE_TOGGLE });
  });
});
