import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { batchActions } from 'redux-batched-actions';

import { OBJLoader, OBJMTLLoader } from '../../render';
import { ModelViewer } from '../model';
import { StringHelper } from 'common';
import { ModelActions, WalkthroughActions, SnapshotActions } from 'webapp/actions';
import { GravatarHelper } from 'webapp/helpers';

const CLASS_NAME = 'cb-ctn-model';

class ModelEditContainer extends PureComponent {
  static fetchData({ dispatch, params }) {
    return dispatch(ModelActions.getModel(params.modelId));
  }

  static propTypes = {
    model: React.PropTypes.instanceOf(Immutable.Map),
    user: React.PropTypes.instanceOf(Immutable.Map)
  };

  constructor(props) {
    super(props);

    this.state = {
      object: {},
      durations: props.walkthroughPoints.map(p => p.get('duration'))
    };
  }

  componentDidMount() {
    this.refreshModel(this.props.model);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model !== this.props.model) {
      this.refreshModel(nextProps.model);
    }

    if (nextProps.walkthroughPoints !== this.props.walkthroughPoints) {
      this.setState({
        durations: nextProps.walkthroughPoints.map(p => p.get('duration')).toJS()
      });
    }
  }

  _onWalkthroughAdd = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.addPoint());
  };

  _onWalkthroughUpdate = (e, index) => {
    e.preventDefault();
    const { dispatch, position } = this.props;
    const { x, y, z } = position.toJS();
    const snapshotToken = StringHelper.randomToken();

    dispatch(batchActions([
      WalkthroughActions.updatePoint(index, { x, y, z }, snapshotToken),
      SnapshotActions.triggerSnapshot(snapshotToken)
    ]));
  };

  _onWalkthroughDelete = (e, index) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.deletePoint(index));
  };

  _onWalkthroughToggleDisjointMode = (e, index) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.toggleDisjointMode(index));
  };

  _onWalkthroughAnimation = (e, index, animationMode) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.updateAnimationMode(index, animationMode));
  };

  _onWalkthroughDurationUpdate = (e, index, duration) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const durations = _.clone(this.state.durations);
    durations[index] = duration;
    this.setState(durations);
    dispatch(WalkthroughActions.updateAnimationDuration(index, duration));
  };

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
            { this._renderWalkthroughSection() }
          </div>
          <div className="col-md-4">
            {
              isUploader &&
              <button className="btn btn-success btn-block cb-margin-bottom-10px">
                SAVE
              </button>
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

  _renderWalkthroughSection() {
    const { walkthroughPoints, position } = this.props;
    const { x, y, z } = position.map(v => Number(v).toFixed(2)).toJS();
    return (
      <div>
        <h3>Current Camera Coordinate:</h3>
        <p>{ `${x}, ${y}, ${z}` }</p>
        <form>
          {
            walkthroughPoints.map((walkthroughPoint, index) => {
              const p = walkthroughPoint.get('pos').map(v => Number(v).toFixed(2));
              return (
                <div key={ index }>
                  <h4>{ `Point ${index + 1}` }</h4>
                  <img src={ this.props.snapshots.get(walkthroughPoint.get('snapshotToken')) }
                    width="240px" height="135px" className="img-thumbnail"></img>
                  <p>
                    { `${p.get('x')}, ${p.get('y')}, ${p.get('z')}` }
                  </p>
                  <button className="btn btn-primary"
                    onClick={ e => this._onWalkthroughUpdate(e, index) } >
                    SET
                  </button>
                  <button className="btn btn-danger" onClick={ e => this._onWalkthroughDelete(e, index) } >
                    DELETE
                  </button>
                  { this._renderWalkthroughToggleDisjointButton(index, walkthroughPoint.get('disjointMode')) }
                  { this._renderWalkthroughAnimationDropdown(index, walkthroughPoint) }
                  { this._renderAnimationDurationField(index) }
                </div>
              );
            })
          }
        </form>
        <button className="btn btn-success" onClick={ this._onWalkthroughAdd }>
          ADD NEW POINT
        </button>
      </div>
    );
  }

  _renderWalkthroughAnimationDropdown(index, point) {
    const disjointMode = point.get('disjointMode');

    if (disjointMode) {
      return this._renderDisjointDropdownMenu(index, point);
    } else {
      return this._renderContinuousDropdownMenu(index, point);
    }
  }

  _renderDisjointDropdownMenu(index, point) {
    const buttonTitle = point.get('animationMode');
    return (
      <DropdownButton bsStyle="info" title={ buttonTitle } id="dropdown-basic-info">
        <MenuItem eventKey="1" onClick={ e => this._onWalkthroughAnimation(e, index, 'Stationary') } >
          Stationary
        </MenuItem>
      </DropdownButton>
    );
  }

  _renderContinuousDropdownMenu(index, point) {
    const buttonTitle = point.get('animationMode');
    return (
      <DropdownButton bsStyle="info" title={ buttonTitle } id="dropdown-basic-info">
        <MenuItem eventKey="1" onClick={ e => this._onWalkthroughAnimation(e, index, 'Stationary') } >
          Stationary
        </MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="2" onClick={ e => this._onWalkthroughAnimation(e, index, 'Translation') } >
          Translation
        </MenuItem>
        <MenuItem eventKey="3" onClick={ e => this._onWalkthroughAnimation(e, index, 'Rotation') } >
          Rotation
        </MenuItem>
        <MenuItem eventKey="4" onClick={ e => this._onWalkthroughAnimation(e, index, 'Zooming') } >
          Zooming
        </MenuItem>
        <MenuItem eventKey="5" onClick={ e => this._onWalkthroughAnimation(e, index, 'Translation + Rotation') } >
          Translation + Rotation
        </MenuItem>
      </DropdownButton>
    );
  }

  _renderWalkthroughToggleDisjointButton(index, status) {
    let buttonTitle;
    let disableStatus;
    if (status === true) {
      buttonTitle = 'Disjoint';
    } else {
      buttonTitle = 'Continuous';
    }

    if (index === 0) {
      disableStatus = true;
    } else {
      disableStatus = false;
    }


    return (
      <button className="btn btn-warning"
        onClick={ e => this._onWalkthroughToggleDisjointMode(e, index) } disabled={ disableStatus }>
      { buttonTitle }
      </button>
    );
  }

  _renderAnimationDurationField(index) {
    const { durations } = this.state;

    return (
      <div className="form-group">
        <label className="control-label" htmlFor={ `walkthrough-point-duration-${index}` }>
          Duration
        </label>
        <input id={ `walkthrough-point-duration-${index}` }
          value={ durations[index] }
          type="text"
          className="form-control"
          placeholder="Enter Duration"
          onChange={ e => this._onWalkthroughDurationUpdate(e, index, e.target.value) } />
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
    resetViewToggle: state.RenderStore.get('resetViewToggle'),
    position: state.CameraStore.get('position'),
    up: state.CameraStore.get('up'),
    lookAt: state.CameraStore.get('lookAt'),
    zoom: state.CameraStore.get('zoom'),

    // Walkthrough Data
    walkthroughPoints: state.WalkthroughStore.get('points'),

    // Snapshot Data
    snapshots: state.SnapshotStore.get('snapshots'),
    snapshotToken: state.SnapshotStore.get('snapshotToken')
  };
})(ModelEditContainer);
