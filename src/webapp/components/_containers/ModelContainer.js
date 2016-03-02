import React from 'react';
import Promise from 'bluebird';
import { Link } from 'react-router';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';

import { OBJLoader, OBJMTLLoader } from '../../render';
import { ModelViewer } from '../model';
import { SnapshotSlider } from '../sliders';
import { ModelActions } from 'webapp/actions';
import { GravatarHelper } from 'webapp/helpers';

const CLASS_NAME = 'cb-ctn-model';

class ModelContainer extends PureComponent {
  static fetchData({ dispatch, params }) {
    return Promise.all([
      dispatch(ModelActions.getModel(params.modelId)),
      dispatch(ModelActions.incrementViews(params.modelId))
    ]);
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
            <h2>Snapshots</h2>
            <SnapshotSlider snapshots={ model.get('imageUrls') } />
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
            { this._renderModelInfoCard() }
            { this._renderModelDownloadLink() }
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
        <div className="panel-body">
          <h3>Uploader </h3>
          <hr />
          <div className="cb-text-center">
            <img className={ `${CLASS_NAME}-user-avatar image-round` } src={ avatarUrl } />
            <h4>{ model.getIn(['uploader', 'name']) }</h4>
          </div>
        </div>
      </div>
    );
  }

  _renderModelInfoCard() {
    const { model } = this.props;

    return (
      <div className={ `${CLASS_NAME}-info-card panel panel-default` }>
        <div className="panel-body">
          <h3>Model Info</h3>
          <hr />
          <p className={ `${CLASS_NAME}-info-label` }>
            Model Name
          </p>
          <p className={ `${CLASS_NAME}-info-content` }>
            { model.get('title') }
          </p>
          <p className={ `${CLASS_NAME}-info-label` }>
            Faces
          </p>
          <p className={ `${CLASS_NAME}-info-content` }>
            { model.getIn(['metaData', 'faces']) }
          </p>
          <p className={ `${CLASS_NAME}-info-label` }>
            Vertices
          </p>
          <p className={ `${CLASS_NAME}-info-content` }>
            { model.getIn(['metaData', 'vertices']) }
          </p>
          <p className={ `${CLASS_NAME}-info-label` }>
            External Texture
          </p>
          <p className={ `${CLASS_NAME}-info-content` }>
            { model.getIn(['metaData', 'hasExternalTexture']) ? 'Yes' : 'No' }
          </p>
          <p className={ `${CLASS_NAME}-info-label` }>
            Description
          </p>
          <p className={ `${CLASS_NAME}-info-content` }>
            { model.get('description') }
          </p>
          <p className={ `${CLASS_NAME}-info-label` }>
            Category
          </p>
          <p className={ `${CLASS_NAME}-info-content` }>
            { model.get('category') }
          </p>
        </div>
      </div>
    );
  }

  _renderModelDownloadLink() {
    const { model } = this.props;

    return (
      <a href={ `/storage/models/${model.get('zipUrl')}` } className="btn btn-success btn-block">
        DOWNLOAD MODEL
      </a>
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
    const urls = model.get('urls').map(u => `/storage/models/${u}`);
    const objUrl = urls.filter(url => url.endsWith('.obj')).get(0);
    loader.load(objUrl, m => {
      this.setState({ model: m });
    });
  }

  loadObjMtl(model) {
    const loader = new OBJMTLLoader();
    const urls = model.get('urls').map(u => `/storage/models/${u}`);
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
    resizedTexture: state.RenderStore.get('resizedTexture'),
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
