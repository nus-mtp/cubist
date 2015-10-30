import React from 'react';
import {connect} from 'react-redux';

import {ModelCanvas} from '../render';
import {RenderActions} from 'webapp/app/actions';

const CLASS_NAME = 'cb-ctn-model';

class ModelContainer extends React.Component {
  static propTypes = {
    isShowingWireframe: React.PropTypes.bool,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired
  }

  _onToggleWireframeButtonClick = () => {
    const {dispatch} = this.props;
    dispatch(RenderActions.toggleWireframe());
  }

  render() {
    const {isShowingWireframe} = this.props;

    return (
      <div className={CLASS_NAME}>
        <h2 className={`${CLASS_NAME}-title`}>
          Model Name
        </h2>
        <div className="row">
          <div className="col-md-8">
            <ModelCanvas showWireframe={isShowingWireframe} />
            <button type="button" className="btn btn-success" onClick={this._onToggleWireframeButtonClick}>
              Toggle Wireframe
            </button>
          </div>
          <div className="col-md-4">
            <div className={`${CLASS_NAME}-info-bar`}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModelContainer;


export default connect((state) => {
  return {
    isShowingWireframe: state.RenderStore.get('isShowingWireframe')
  };
})(ModelContainer);
