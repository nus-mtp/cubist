import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { OBJLoader, OBJMTLLoader } from '../../render';
import { ModelViewer } from '../model';
import { ModelActions } from 'webapp/actions';

const CLASS_NAME = 'cb-ctn-model';

class ModelContainer extends React.Component {
  static fetchData({ dispatch, params }) {
    return dispatch(ModelActions.getModel(params.modelId));
  }

  static propTypes = {
    model: React.PropTypes.instanceOf(Immutable.Map)
  };

  state = {
    object: {}
  };

  // This is only for testing
  // Currently we are loading the model JSON data from the rendering server instead of storage service
  componentDidMount() {
    this.refreshModel(this.props.model);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model !== this.props.model) {
      this.refreshModel(nextProps.model);
    }
  }

  render() {
    const { object } = this.state;

    return (
      <div className={ CLASS_NAME }>
        <h2 className={ `${CLASS_NAME}-title` }>
          Model Name
        </h2>
        <div className="row">
          <div className="col-md-8">
            <ModelViewer object={ object } />
          </div>
          <div className="col-md-4">
            <div className={ `${CLASS_NAME}-info-bar` }>
            </div>
          </div>
        </div>
      </div>
    );
  }

  refreshModel(model) {
    if (model.get('urls').size > 1) {
      this.loadObjMtl(model);
    } else {
      this.loadObj(model);
    }
  }

  loadObj(model) {
    const loader = new OBJLoader();
    const urls = model.get('urls').map(u => `/models/${u}`);
    loader.load(urls.get(0), m => {
      this.setState({ model: m });
    });
  }

  loadObjMtl(model) {
    const loader = new OBJMTLLoader();
    const urls = model.get('urls').map(u => `/models/${u}`);
    loader.load(urls.get(0), urls.get(1), m => {
      this.setState({ object: m });
    });
  }
}

export default connect((state) => {
  const currentId = state.ModelStore.get('modelId');

  return {
    model: state.ModelStore.getIn(['models', currentId])
  };
})(ModelContainer);
