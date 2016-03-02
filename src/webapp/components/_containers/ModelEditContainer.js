import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import { DropdownButton, MenuItem, SplitButton } from 'react-bootstrap';
import { batchActions } from 'redux-batched-actions';

import { OBJLoader, OBJMTLLoader } from '../../render';
import { ModelViewer } from '../model';
import { SnapshotSlider } from '../sliders';
import { StringHelper, Constants } from 'common';
import { ModelActions, WalkthroughActions, SnapshotActions } from 'webapp/actions';
import { GravatarHelper } from 'webapp/helpers';
import { REQ_PUT_UPDATE_MODEL_INFO } from 'webapp/actions/types';

const CLASS_NAME = 'cb-ctn-model';

const MODEL_TITLE_FIELD = 'title';
const MODEL_DESC_FIELD = 'description';
const MODEL_CATEGORY_FIELD = 'category';
const MODEL_TAGS_FIELD = 'tags';

class ModelEditContainer extends PureComponent {
  static fetchData({ dispatch, params }) {
    return dispatch(ModelActions.getModel(params.modelId));
  }

  static propTypes = {
    model: React.PropTypes.instanceOf(Immutable.Map),
    user: React.PropTypes.instanceOf(Immutable.Map),
    err: React.PropTypes.instanceOf(Immutable.Map),
    success: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,

    walkthroughPoints: React.PropTypes.instanceOf(Immutable.List),
    playbackPoints: React.PropTypes.instanceOf(Immutable.List),
    walkthroughToggle: React.PropTypes.bool,
    viewIndex: React.PropTypes.number,
    position: React.PropTypes.instanceOf(Immutable.Map),
    lookAt: React.PropTypes.instanceOf(Immutable.Map),
    snapshots: React.PropTypes.instanceOf(Immutable.Map)
  };

  constructor(props) {
    super(props);

    this.state = {
      object: {},

      // Model Info
      modelInfoData: {
        [MODEL_TITLE_FIELD]: props.model.get(MODEL_TITLE_FIELD),
        [MODEL_DESC_FIELD]: props.model.get(MODEL_DESC_FIELD),
        [MODEL_CATEGORY_FIELD]: props.model.get(MODEL_CATEGORY_FIELD, ''),
        [MODEL_TAGS_FIELD]: props.model.get(MODEL_TAGS_FIELD).toJS().join(', ')
      },

      // Walkthrough
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

    if (nextProps.model !== this.props.model) {
      this.setState({
        modelInfoData: {
          [MODEL_TITLE_FIELD]: nextProps.model.get(MODEL_TITLE_FIELD),
          [MODEL_DESC_FIELD]: nextProps.model.get(MODEL_DESC_FIELD),
          [MODEL_CATEGORY_FIELD]: nextProps.model.get(MODEL_CATEGORY_FIELD),
          [MODEL_TAGS_FIELD]: nextProps.model.get(MODEL_TAGS_FIELD).toJS().join(', ')
        }
      });
    }
  }

  // -----------------------------------------------------
  // -----------------MODEL INFO EVENT HANDLER------------
  // -----------------------------------------------------

  _onModelInfoInputChange = (fieldId, value) => {
    const modelInfoData = _.cloneDeep(this.state.modelInfoData);
    modelInfoData[fieldId] = value;
    this.setState({ modelInfoData });
  };

  _onModelInfoUpdateFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch, model } = this.props;
    const { modelInfoData } = this.state;
    dispatch(ModelActions.updateModelInfo(model.get('_id'), modelInfoData));
  };

  // -----------------------------------------------------
  // -----------------SNAPSHOTS EVENT HANDLER------------
  // -----------------------------------------------------

  _onSnapshotsAdd = (snapshots) => {
    const { dispatch, params } = this.props;
    dispatch(ModelActions.addSnapshots(params.modelId, snapshots));
  };

  // -----------------------------------------------------
  // ----------MODEL WALKTHROUGH EVENT HANDLER------------
  // -----------------------------------------------------

  _onWalkthroughAdd = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.addPoint());
  };

  _onWalkthroughUpdate = (e, index) => {
    e.preventDefault();
    const { dispatch, position, lookAt } = this.props;
    const { x, y, z } = position.toJS();

    const lookAtList = lookAt.toJS();
    const snapshotToken = StringHelper.randomToken();

    dispatch(batchActions([
      WalkthroughActions.updatePoint(index, { x, y, z }, lookAtList, snapshotToken),
      SnapshotActions.triggerSnapshot(snapshotToken)
    ]));
  };

  _onWalkthroughDelete = (e, index) => {
    e.preventDefault();
    const lol = this.props.walkthroughPoints;
    const { dispatch } = this.props;
    dispatch(lol);
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

  _onWalkthroughSetStart = (e, index) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.setPlaybackStart(index));
  };

  _onWalkthroughSetEnd = (e, index) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.setPlaybackEnd(index));
  };

  _onWalkthroughPlayback = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.playbackWalkthrough());
  };

  _onWalkthroughViewPoint = (e, index) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.viewWalkthroughPoint(index));
  };

  render() {
    const { model } = this.props;
    const { object } = this.state;
    const viewerProps = {
      object,
      ...this.props
    };

    return (
      <div className={ CLASS_NAME }>
        <h2 className={ `${CLASS_NAME}-title` }>
          { model.get('title') }
        </h2>
        <div className="row">
          <div className="col-md-8">
            <ModelViewer { ...viewerProps } />
            <h2>Snapshots</h2>
            <SnapshotSlider
              isEditor
              snapshots={ model.get('imageUrls') }
              onSnapshotsAdd={ this._onSnapshotsAdd } />
            <h2>Walkthroughs</h2>
            { false && this._renderWalkthroughSection() }
            { false && this._renderWalkthroughPlaybackSection() }
          </div>
          <div className="col-md-4">
            <form onSubmit={ this._onModelInfoUpdateFormSubmit }>
              { this._renderInfoStatusMessage() }
              <button type="submit" className="btn btn-success btn-block cb-margin-bottom-10px">
                SAVE
              </button>
              { this._renderUploaderCard() }
              { this._renderModelInfoCard() }
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // -----------------MODEL INFO RENDER-------------------
  // -----------------------------------------------------

  _renderInfoStatusMessage() {
    const { err, success } = this.props;

    return (
      <div>
        {
          err &&
          <div className="alert alert-danger cb-margin-bottom-10px">
            { err.get('message') }
          </div>
        }
        {
          success &&
          <div className="alert alert-success cb-margin-bottom-10px">
            Update Successfully
          </div>
        }
      </div>
    );
  }

  _renderUploaderCard() {
    const { user } = this.props;
    const avatarUrl = GravatarHelper.getGravatarUrl(user.get('email'));

    return (
      <div className={ `${CLASS_NAME}-user-card panel panel-default` }>
        <div className="panel-body cb-text-center">
          <img className={ `${CLASS_NAME}-user-avatar image-round` } src={ avatarUrl } />
          <hr />
          <h4>{ user.get('name') }</h4>
        </div>
      </div>
    );
  }

  _renderModelInfoCard() {
    const { modelInfoData } = this.state;

    return (
      <div className={ `${CLASS_NAME}-model-info-card panel panel-default` }>
        <div className="panel-body">
          <h3>ABOUT THIS MODEL</h3>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_TITLE_FIELD}` }>
              Model Name *
            </label>
            <input id={ `model-${MODEL_TITLE_FIELD}` }
              type="text"
              className="form-control"
              placeholder="Model Name"
              value={ modelInfoData[MODEL_TITLE_FIELD] }
              onChange={ (e) => this._onModelInfoInputChange(MODEL_TITLE_FIELD, e.target.value) } />
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_DESC_FIELD}` }>
              Model Description
            </label>
            <textarea id={ `model-${MODEL_DESC_FIELD}` }
              rows="8"
              className="form-control"
              value={ modelInfoData[MODEL_DESC_FIELD] }
              onChange={ (e) => this._onModelInfoInputChange(MODEL_DESC_FIELD, e.target.value) } />
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_CATEGORY_FIELD}` }>
              Model Category
            </label>
            <select onChange={ e => this._onModelInfoInputChange(MODEL_CATEGORY_FIELD, e.target.value) }
              value={ modelInfoData[MODEL_CATEGORY_FIELD] }
              className="form-control"
              id={ `model-${MODEL_CATEGORY_FIELD}` }>
              <option value="">Select One</option>
              {
                Constants.MODEL_CATEGORIES.map((c, i) => (
                  <option key={ i } value={ c.toLowerCase() }>{ c }</option>
                ))
              }
            </select>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_TAGS_FIELD}` }>
              Model Tags
            </label>
            <textarea id={ `model-${MODEL_TAGS_FIELD}` }
              rows="3"
              className="form-control"
              value={ modelInfoData[MODEL_TAGS_FIELD] }
              onChange={ (e) => this._onModelInfoInputChange(MODEL_TAGS_FIELD, e.target.value) } />
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // ----------------- WALKTHROUGH RENDER-----------------
  // -----------------------------------------------------
  _renderWalkthroughSection() {
    const { walkthroughPoints, position, lookAt } = this.props;
    const { x, y, z } = position.map(v => Number(v).toFixed(2)).toJS();
    return (
      <div>
        <h3>Current Camera Coordinate:</h3>
        <p>{ `${x}, ${y}, ${z}` }</p>
        <h3>Current Camera lookAt:</h3>
        <p>{ `${lookAt.get('x')}, ${lookAt.get('y')}, ${lookAt.get('z')}` }</p>
        <form>
          {
            walkthroughPoints.map((walkthroughPoint, index) => {
              const p = walkthroughPoint.get('pos').map(v => Number(v).toFixed(2));
              return (
                <div key={ index }>
                  <h4>{ `Point ${index + 1}` }</h4>
                  <img src={ this.props.snapshots.get(walkthroughPoint.get('snapshotToken')) }
                    width="240px" height="135px" className="img-thumbnail"></img>
                    { this._renderViewPointButton(index, walkthroughPoint) }
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

  _renderViewPointButton(index, point) {
    let canRender = true;

    if (point.get('snapshotToken') === undefined) {
      canRender = false;
    }

    if (canRender) {
      return (
        <button className="btn btn-info" onClick={ e => this._onWalkthroughViewPoint(e, index) } >
        View Point
        </button>
      );
    }
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
    const { walkthroughPoints } = this.props;
    const { durations } = this.state;

    if (index !== (walkthroughPoints.size - 1)) {
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
  }

  _renderWalkthroughPlaybackSection() {
    const { walkthroughPoints, playbackPoints, walkthroughToggle } = this.props;
    const startIndex = playbackPoints.first();
    const endIndex = playbackPoints.last();
    let disableStatus = false;
    let buttonTitle = 'Play Walkthrough';

    if (walkthroughToggle) {
      buttonTitle = 'Stop Walkthrough';
    }

    if (startIndex === endIndex || startIndex > endIndex) {
      disableStatus = true;
    }

    if (walkthroughPoints.count() > 1) {
      return (
        <div><p></p>
        Playback From
         <SplitButton title={ `${startIndex + 1}` } pullRight id="split-button-pull-right" >
          { walkthroughPoints.map((walkthroughPoint, index) =>
            <MenuItem eventKey={ `${index + 1}` } key={ 'start_' + `${index}` }
              onClick={ e => this._onWalkthroughSetStart(e, index) } >
              { `${index + 1}` }
            </MenuItem>
          ) }
        </SplitButton>
         To
        <SplitButton title={ `${endIndex + 1}` } pullRight id="split-button-pull-right" >
          { walkthroughPoints.map((walkthroughPoint, index) =>
            <MenuItem eventKey={ `${index + 1}` } key={ 'end_' + `${index}` }
              onClick={ e => this._onWalkthroughSetEnd(e, index) } >
              { `${index + 1}` }
            </MenuItem>
          ) }
        </SplitButton>
        <p>
          <button className="btn btn-primary" onClick={ e => this._onWalkthroughPlayback(e) }
            disabled={ disableStatus } >
          { buttonTitle }
          </button>
        </p>
        </div>
      );
    }
  }

  // -----------------------------------------------------
  // -----------------MODEL LOADER------------------------
  // -----------------------------------------------------
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
    err: state.RequestStore.getIn(['err', REQ_PUT_UPDATE_MODEL_INFO]),
    success: state.RequestStore.getIn(['success', REQ_PUT_UPDATE_MODEL_INFO]),

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
    playbackPoints: state.WalkthroughStore.get('playbackPoints'),
    walkthroughToggle: state.WalkthroughStore.get('walkthroughToggle'),
    viewIndex: state.WalkthroughStore.get('viewIndex'),

    // Snapshot Data
    snapshots: state.SnapshotStore.get('snapshots'),
    snapshotToken: state.SnapshotStore.get('snapshotToken')
  };
})(ModelEditContainer);
