import {expect} from 'chai';
import {Map} from 'immutable';
import RenderReducer from 'webapp/reducers/RenderReducer';
import ActionTypes from 'webapp/actions/types';

describe('Render reducer', () => {
  it('Should return the initial state', () => {
    expect(RenderReducer(undefined, {})).to.equal(Map({
      showWireframe: false,
      showShading: 0,
      isAutoRotate: false
    }));
  });
});
