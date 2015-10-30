import React from 'react';
import {connect} from 'react-redux';

import {ModelCanvas} from '../render';
import {RenderActions} from 'webapp/app/actions';

const CLASS_NAME = 'cb-model-viewer';

/**
 * Main Model Viewer to interact with model
 */
class ModelViewer extends React.Component {
  static propTypes = {
    showWireframe: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired
  }

  _onToggleWireframeButtonClick = () => {
    const {dispatch} = this.props;
    dispatch(RenderActions.toggleWireframe());
  }

  render() {
    const {showWireframe} = this.props;

    return (
      <div className={CLASS_NAME}>
        <ModelCanvas showWireframe={showWireframe} />
        <button type="button"
          className="btn btn-success"
          onClick={this._onToggleWireframeButtonClick}>
          Toggle Wireframe
        </button>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    showWireframe: state.RenderStore.get('showWireframe')
  };
})(ModelViewer);
