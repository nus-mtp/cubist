import React from 'react';
import { Link } from 'react-router';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';

import { OBJLoader, OBJMTLLoader } from '../../render';
import { ModelViewer } from '../model';
import { ModelActions } from 'webapp/actions';
import { GravatarHelper } from 'webapp/helpers';

const CLASS_NAME = 'cb-ctn-model';

class ModelContainer extends PureComponent {
  static fetchData({ dispatch, params }) {
    return dispatch(ModelActions.getModel(params.modelId));
  }

  static propTypes = {
    model: React.PropTypes.instanceOf(Immutable.Map),
    user: React.PropTypes.instanceOf(Immutable.Map)
  };

  state = {
    object: {}
  };

  componentDidMount() {
    this.refreshModel(this.props.model);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model !== this.props.model) {
      this.refreshModel(nextProps.model);
    }
  }

  render() {
    const { model, user } = this.props;
    const { object } = this.state;
    const viewerProps = {
      object,
      ...this.props
    };
    const isUploader = model.getIn(['uploader', '_id']) === user.get('_id');

    return (
      <div className={ CLASS_NAME }>
        <h2 className={ `${CLASS_NAME}-title` }>
          { model.get('title') }
        </h2>
        <div className="row">
          <div className="col-md-8">
            <ModelViewer { ...viewerProps } />
          </div>
          <div className="col-md-4">
            {
              isUploader &&
              <Link to={ `/model/${model.get('_id')}/edit` }
                className="btn btn-info btn-block cb-margin-bottom-10px">
                EDIT MODEL
              </Link>
            }
            { this._renderUploaderCard() }
          </div>
        </div>
      </div>
    );
  }

  _renderUploaderCard() {
    const { model } = this.props;
    const avatarUrl = GravatarHelper.getGravatarUrl(model.getIn(['uploader', 'email']));

    return (
      <div className={ `${CLASS_NAME}-user-card panel panel-default` }>
        <div className="panel-body cb-text-center">
          <img className={ `${CLASS_NAME}-user-avatar image-round` } src={ avatarUrl } />
          <hr />
          <h4>{ model.getIn(['uploader', 'name']) }</h4>
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
    const objUrl = urls.filter(url => url.endsWith('.obj')).get(0);
    loader.load(objUrl, m => {
      this.setState({ model: m });
    });
  }

  loadObjMtl(model) {
    const loader = new OBJMTLLoader();
    const urls = model.get('urls').map(u => `/models/${u}`);
    const objUrl = urls.filter(url => url.endsWith('.obj')).get(0);
    const mtlUrl = urls.filter(url => url.endsWith('mtl')).get(0);
    loader.load(objUrl, mtlUrl, m => {
      this.setState({ object: m });
    });
  }
}

export default connect((state) => {
  const currentId = state.ModelStore.get('modelId');

  return {
    // Model Info
    model: state.ModelStore.getIn(['models', currentId]),

    // Viewer Data
    wireframe: state.RenderStore.get('wireframe'),
    shadingMode: state.RenderStore.get('shadingMode'),
    autoRotate: state.RenderStore.get('autoRotate'),
    walkthroughPoints: state.WalkthroughStore.get('points'),
    playbackPoints: state.WalkthroughStore.get('playbackPoints'),
    walkthroughToggle: state.WalkthroughStore.get('walkthroughToggle'),
    viewIndex: state.WalkthroughStore.get('viewIndex'),
    resetViewToggle: state.RenderStore.get('resetViewToggle'),
    position: state.CameraStore.get('position'),
    up: state.CameraStore.get('up'),
    lookAt: state.CameraStore.get('lookAt'),
    zoom: state.CameraStore.get('zoom'),

    // Snapshot Data
    snapshots: state.SnapshotStore.get('snapshots'),
    snapshotToken: state.SnapshotStore.get('snapshotToken')
  };
})(ModelContainer);
