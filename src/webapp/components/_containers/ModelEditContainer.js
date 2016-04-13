 import Bluebird from 'bluebird';
 import React from 'react';
 import _ from 'lodash';
 import Immutable from 'immutable';
 import { connect } from 'react-redux';
 import PureComponent from 'react-pure-render/component';
 import { DropdownButton, MenuItem, SplitButton, ButtonGroup } from 'react-bootstrap';

 import { OBJLoader, OBJMTLLoader } from '../../render';
 import { ModelViewer } from '../model';
 import { SnapshotSlider, WalkthroughSlider, StatisticsSlider } from '../sliders';
 import { StringHelper, Constants } from 'common';
 import { ModelActions, WalkthroughActions, SnapshotActions, CameraActions } from 'webapp/actions';
 import { GravatarHelper } from 'webapp/helpers';
 import { REQ_PUT_UPDATE_MODEL_INFO } from 'webapp/actions/types';

 const CLASS_NAME = 'cb-ctn-model-edit';

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
    quaternion: React.PropTypes.instanceOf(Immutable.Map),
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

      // Insert
      insertTargetIndex: 0,
      selected: undefined,
      insertToggle: false,
      statisticsPoints: undefined,

      // Statistics
      statisticsIndex: 0,

      // Walkthrough
      selectedWalkthroughIndex: undefined
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
  // -----------------MODEL LOAD HANDLER------------------
  // -----------------------------------------------------

  _onModelLoad = () => {
    const { dispatch, walkthroughPoints } = this.props;
    let promise = Bluebird.resolve();
    walkthroughPoints.forEach((walkthroughPoint, index) => {
      promise = promise
        .then(() => new Promise((resolve) => setTimeout(resolve, 100)))
        .then(() => dispatch(WalkthroughActions.viewWalkthroughPoint(index)))
        .then(() => new Promise((resolve) => setTimeout(resolve, 100)))
        .then(() => dispatch(SnapshotActions.triggerSnapshot(walkthroughPoint.get('key'))));
    });

    if (this.state.statisticsPoints === undefined) {
      const { model } = this.props;
      this._initStatisticsPoints(model.get('popularPoints'));
    }

    const { statisticsPoints } = this.state;

    statisticsPoints.forEach((currStatsPoint) => {
      const { pos, lookAt, snapshotToken } = currStatsPoint.toJS();
      promise = promise
        .then(() => new Promise((resolve) => setTimeout(resolve, 100)))
        .then(() => dispatch(CameraActions.setCameraView(pos, lookAt)))
        .then(() => new Promise((resolve) => setTimeout(resolve, 100)))
        .then(() => dispatch(SnapshotActions.triggerSnapshot(snapshotToken)));
    });

    return promise;
  };

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
  _onWalkthroughSelect = (index) => {
    this.setState({
      selectedWalkthroughIndex: index
    });
  };

  _onWalkthroughAdd = () => {
    const { dispatch, params, position, lookAt, quaternion } = this.props;
    const key = StringHelper.randomToken();
    dispatch(WalkthroughActions.addWalkthrough(params.modelId, {
      key,
      pos: position.toJS(),
      lookAt: lookAt.toJS(),
      quaternion: quaternion.toJS()
    }));
    dispatch(SnapshotActions.triggerSnapshot(key));
  };

  _onWalkthroughPositionUpdate = (e) => {
    e.preventDefault();
    const { walkthroughPoints, dispatch, params, position, lookAt, quaternion } = this.props;
    const { selectedWalkthroughIndex } = this.state;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);

    dispatch(WalkthroughActions.updateWalkthrough(
      params.modelId,
      selectedWalkthroughIndex,
      {
        pos: position.toJS(),
        lookAt: lookAt.toJS(),
        quaternion: quaternion.toJS()
      }
    ));
    dispatch(SnapshotActions.triggerSnapshot(walkthrough.get('key')));
  };

  _onWalkthroughDelete = (e) => {
    e.preventDefault();
    const { dispatch, params } = this.props;
    const { selectedWalkthroughIndex } = this.state;
    dispatch(WalkthroughActions.deleteWalkthrough(params.modelId, selectedWalkthroughIndex));
  };

  _onWalkthroughToggleDisjointMode = (e) => {
    e.preventDefault();
    const { walkthroughPoints, dispatch, params } = this.props;
    const { selectedWalkthroughIndex } = this.state;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);

    dispatch(WalkthroughActions.updateWalkthrough(
      params.modelId,
      selectedWalkthroughIndex,
      {
        disjointMode: !walkthrough.get('disjointMode')
      }
    ));
  };

  _onWalkthroughAnimationUpdate = (e, animationMode) => {
    e.preventDefault();
    const { dispatch, params } = this.props;
    const { selectedWalkthroughIndex } = this.state;

    dispatch(WalkthroughActions.updateWalkthrough(
      params.modelId,
      selectedWalkthroughIndex,
      {
        animationMode
      }
    ));
  };

  _onWalkthroughDurationUpdate = (e, duration) => {
    e.preventDefault();
    const { dispatch, params } = this.props;
    const { selectedWalkthroughIndex } = this.state;

    dispatch(WalkthroughActions.updateWalkthrough(
      params.modelId,
      selectedWalkthroughIndex,
      {
        duration
      }
    ));
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

  _onWalkthroughViewPoint = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { selectedWalkthroughIndex } = this.state;
    dispatch(WalkthroughActions.viewWalkthroughPoint(selectedWalkthroughIndex));
  };

  // -----------------------------------------------------
  // -----------------STATISTICS EVENT HANDLER------------
  // -----------------------------------------------------
  _initStatisticsPoints = (points) => {
    const tempArray = new Array(points.size);

    for (let i = 0; i < points.size; i++) {
      const { camSegX, camSegY, camSegZ, lookAtSegX, lookAtSegY, lookAtSegZ, count } = points.toJS()[i];
      const pos = { x: camSegX, y: camSegY, z: camSegZ };
      const lookAt = { x: lookAtSegX, y: lookAtSegY, z: lookAtSegZ };
      const snapshotToken = StringHelper.randomToken();
      const key = snapshotToken;

      tempArray[i] = { key, pos, lookAt, snapshotToken, count };
    }
    this.setState({ statisticsPoints: Immutable.fromJS(tempArray) });
  };

  _onStatisticsViewPoint = (e, index) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const pointList = this.state.statisticsPoints.toJS();
    const { pos, lookAt } = pointList[index];

    dispatch(CameraActions.setCameraView(pos, lookAt));
  };

  _onStatisticsSelect = (index) => {
    this.setState({
      selected: index
    });
  };

  _onInsertButtonClicked = (e, index) => {
    e.preventDefault();

    this.setState({ insertToggle: !this.state.insertToggle });
    this.setState({ selected: index });
  };

  _onInsertSetIndex = (e, index) => {
    e.preventDefault();
    this.setState({ insertTargetIndex: index });
  };

  _onInsertIntoWalkthrough = (e, targetIndex, currentIndex, controlToggle) => {
    e.preventDefault();
    const { dispatch, params } = this.props;
    const { statisticsPoints } = this.state;
    const key = StringHelper.randomToken();

    const curr = statisticsPoints.toJS()[currentIndex];
    const pos = { x: curr.pos.x, y: curr.pos.y, z: curr.pos.z };
    const lookAt = { x: curr.lookAt.x, y: curr.lookAt.y, z: curr.lookAt.z };
    const newWalkthrough = { key, pos, lookAt, quaternion: { x: 0, y: 0, z: 0, w: 0 } };
    this._onInsertButtonClicked(e);
    dispatch(WalkthroughActions.addWalkthrough(
      params.modelId,
      newWalkthrough,
      targetIndex,
      controlToggle === 'before')
    );
    
    return Promise
        .resolve()
        .then(() => dispatch(CameraActions.setCameraView(pos, lookAt)))
        .then(() => new Promise((resolve) => setTimeout(resolve, 100)))
        .then(() => dispatch(SnapshotActions.triggerSnapshot(key)));
  };

  render() {
    const { model, walkthroughPoints, snapshots } = this.props;
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
              snapshots={ model.get('imageUrls', new Immutable.List()) }
              onSnapshotsAdd={ this._onSnapshotsAdd } />
            <h2>Walkthroughs</h2>
            <div className={ `${CLASS_NAME}-walkthrough` }>
              <WalkthroughSlider
                isEditor
                snapshots={ snapshots }
                walkthroughs={ walkthroughPoints }
                onWalkthroughAdd={ this._onWalkthroughAdd }
                onWalkthroughSelect={ this._onWalkthroughSelect } />
              { this._renderWalkthroughSection() }
              { this._renderWalkthroughPlaybackSection() }
            </div>
            <h2>Popular View Points</h2>
            <div className={ `${CLASS_NAME}-walkthrough` }>
              <StatisticsSlider
                isEditor
                snapshots={ snapshots }
                statistics={ this.state.statisticsPoints }
                onStatisticsSelect={ this._onStatisticsSelect } />
              { this._renderStatisticsSection() }
            </div>
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
          <img className={ `${CLASS_NAME}-user-avatar cb-image-round` } src={ avatarUrl } />
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
    const { selectedWalkthroughIndex } = this.state;
    if (typeof selectedWalkthroughIndex === 'undefined') {
      return undefined;
    }

    const { walkthroughPoints } = this.props;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);
    const position = walkthrough.get('pos');
    const lookAt = walkthrough.get('lookAt');
    return (
      <div className={ `${CLASS_NAME}-walkthrough-form` }>
        <h5>Position</h5>
        <p>
          { `${position.get('x')}, ${position.get('y')}, ${position.get('z')}` }
        </p>
        <h5>Look At</h5>
        <p>
          { `${lookAt.get('x')}, ${lookAt.get('y')}, ${lookAt.get('z')}` }
        </p>
        { this._renderViewPointButton() }
        <button className="btn btn-primary cb-margin-left-10px" onClick={ this._onWalkthroughPositionUpdate }>
          Update Position
        </button>
        { this._renderWalkthroughToggleDisjointButton() }
        { this._renderWalkthroughAnimationDropdown() }
        { this._renderAnimationDurationField() }
      </div>
    );
  }

  _renderViewPointButton() {
    return (
      <button className="btn btn-info" onClick={ e => this._onWalkthroughViewPoint(e) }>
        View Point
      </button>
    );
  }

  _renderWalkthroughAnimationDropdown() {
    const { selectedWalkthroughIndex } = this.state;
    const { walkthroughPoints } = this.props;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);
    const disjointMode = walkthrough.get('disjointMode');

    if (disjointMode) {
      return this._renderDisjointDropdownMenu();
    } else {
      return this._renderContinuousDropdownMenu();
    }
  }

  _renderDisjointDropdownMenu() {
    const { selectedWalkthroughIndex } = this.state;
    const { walkthroughPoints } = this.props;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);
    const buttonTitle = walkthrough.get('animationMode');

    return (
      <DropdownButton bsStyle="info"
        className="cb-margin-left-10px"
        title={ buttonTitle }
        id="dropdown-basic-info">
        <MenuItem eventKey="1" onClick={ e => this._onWalkthroughAnimationUpdate(e, 'Stationary') } >
          Stationary
        </MenuItem>
      </DropdownButton>
    );
  }

  _renderContinuousDropdownMenu() {
    const { selectedWalkthroughIndex } = this.state;
    const { walkthroughPoints } = this.props;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);
    const buttonTitle = walkthrough.get('animationMode');

    return (
      <DropdownButton bsStyle="info"
        className="cb-margin-left-10px"
        title={ buttonTitle }
        id="dropdown-basic-info">
        <MenuItem eventKey="1" onClick={ e => this._onWalkthroughAnimationUpdate(e, 'Stationary') } >
          Stationary
        </MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="2" onClick={ e => this._onWalkthroughAnimationUpdate(e, 'Linear') } >
          Linear
        </MenuItem>
        <MenuItem eventKey="3" onClick={ e => this._onWalkthroughAnimationUpdate(e, 'Spherical') } >
          Spherical
        </MenuItem>
      </DropdownButton>
    );
  }

  _renderWalkthroughToggleDisjointButton() {
    const { selectedWalkthroughIndex } = this.state;
    const { walkthroughPoints } = this.props;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);
    const status = walkthrough.get('disjointMode');

    let buttonTitle;
    let disableStatus;
    if (status === true) {
      buttonTitle = 'Disjoint';
    } else {
      buttonTitle = 'Continuous';
    }

    if (selectedWalkthroughIndex === 0) {
      disableStatus = true;
    } else {
      disableStatus = false;
    }

    return (
      <button className="btn btn-warning cb-margin-left-10px"
        onClick={ this._onWalkthroughToggleDisjointMode }
        disabled={ disableStatus }>
        { buttonTitle }
      </button>
    );
  }

  _renderAnimationDurationField() {
    const { selectedWalkthroughIndex } = this.state;
    const { walkthroughPoints } = this.props;
    const walkthrough = walkthroughPoints.get(selectedWalkthroughIndex);

    if (selectedWalkthroughIndex !== (walkthroughPoints.size - 1)) {
      return (
        <div className="form-group">
          <label className="control-label" htmlFor={ `walkthrough-point-duration-${selectedWalkthroughIndex}` }>
            Duration
          </label>
          <input id={ `walkthrough-point-duration-${selectedWalkthroughIndex}` }
            value={ walkthrough.get('duration') }
            type="text"
            className="form-control"
            placeholder="Enter Duration"
            onChange={ e => this._onWalkthroughDurationUpdate(e, e.target.value) } />
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
      buttonTitle = 'Playing Walkthrough...';
      disableStatus = true;
    }

    if (startIndex === endIndex || startIndex > endIndex) {
      disableStatus = true;
    }

    if (walkthroughPoints.count() > 1) {
      return (
        <div className={ `${CLASS_NAME}-walkthrough-playback` }>
          Playback From
          <SplitButton title={ `${startIndex + 1}` }
            className="cb-margin-left-10px"
            id="split-button-pull-right" >
            { walkthroughPoints.map((walkthroughPoint, index) =>
              <MenuItem eventKey={ `${index + 1}` } key={ 'start_' + `${index}` }
                onClick={ e => this._onWalkthroughSetStart(e, index) } >
                { `${index + 1}` }
              </MenuItem>
            ) }
          </SplitButton>
          <span className="cb-margin-left-10px">To</span>
          <SplitButton title={ `${endIndex + 1}` }
            className="cb-margin-left-10px"
            id="split-button-pull-right" >
            { walkthroughPoints.map((walkthroughPoint, index) =>
              <MenuItem eventKey={ `${index + 1}` } key={ 'end_' + `${index}` }
                onClick={ e => this._onWalkthroughSetEnd(e, index) } >
                { `${index + 1}` }
              </MenuItem>
            ) }
          </SplitButton>
          <button className="btn btn-primary cb-margin-left-10px" onClick={ e => this._onWalkthroughPlayback(e) }
            disabled={ disableStatus } >
          { buttonTitle }
          </button>
        </div>
      );
    }
  }

  // -----------------------------------------------------
  // ----------------- Statistics ------------------------
  // -----------------------------------------------------
  _renderStatisticsSection() {
    const { selected, statisticsPoints } = this.state;
    if (typeof selected === 'undefined') {
      return undefined;
    }

    const stats = statisticsPoints.get(selected);
    const position = stats.get('pos');
    const lookAt = stats.get('lookAt');
    const views = stats.get('count');
    return (
      <div className={ `${CLASS_NAME}-walkthrough-form` }>
        <h5>Position</h5>
        <p>
          { `${position.get('x')}, ${position.get('y')}, ${position.get('z')}` }
        </p>
        <h5>Look At</h5>
        <p>
          { `${lookAt.get('x')}, ${lookAt.get('y')}, ${lookAt.get('z')}` }
        </p>
        <h5>Numbers of Views: { views } </h5>
        { this._renderStatViewPointButton(selected) }
        { this._renderInsertButton(selected, stats) }
      </div>
    );
  }

  _renderStatViewPointButton(index) {
    return (
      <button className="btn btn-info" onClick={ e => this._onStatisticsViewPoint(e, index) }>
        View Point
      </button>
    );
  }

  _renderInsertButton(index, point) {
    const { insertToggle } = this.state;
    let canRender = true;
    let buttonType = 'btn btn-warning';
    let buttonTitle = 'Insert';

    if (insertToggle) {
      buttonTitle = 'Cancel Insert';
      buttonType = 'btn btn-danger';
    }

    if (point.get('snapshotToken') === undefined) {
      canRender = false;
    }

    if (canRender) {
      return (
        <ButtonGroup>
        <button className={ buttonType } onClick={ e => this._onInsertButtonClicked(e, index) } >
        { buttonTitle }
        </button>
        { insertToggle && this._renderInsertPointButtonGroup() }
        </ButtonGroup>
      );
    }
  }

  _renderInsertPointButtonGroup() {
    const { walkthroughPoints } = this.props;
    const { insertTargetIndex, selected } = this.state;

    return (
      <ButtonGroup>
          <SplitButton title={ `${ insertTargetIndex + 1}` } pullRight id="split-button-pull-right" >
            {
              walkthroughPoints.map((walkthroughPoint, index) => (
                <MenuItem eventKey={ `${index + 1}` } key={ 'insert_' + `${index}` }
                  onClick={ e => this._onInsertSetIndex(e, index) } >
                  { `${index + 1}` }
                </MenuItem>
              ))
            }
          </SplitButton>
          <button className="btn btn-success"
            onClick={ e => this._onInsertIntoWalkthrough(e, insertTargetIndex, selected, 'before') }>
            Insert Before
          </button>
          <button className="btn btn-success"
            onClick={ e => this._onInsertIntoWalkthrough(e, insertTargetIndex, selected, 'after') }>
            Insert After
          </button>
      </ButtonGroup>
    );
  }

  // -----------------------------------------------------
  // -----------------MODEL LOADER------------------------
  // -----------------------------------------------------
  refreshModel(model) {
    if (model.get('urls').size > 1) {
      this.loadObjMtl(model, () => this._onModelLoad());
    } else {
      this.loadObj(model, () => this._onModelLoad());
    }

    this._initStatisticsPoints(model.get('popularPoints'));
  }

  loadObj(model, cb) {
    const loader = new OBJLoader();
    const urls = model.get('urls').map(u => `/storage/models/${u}`);
    const objUrl = urls.filter(url => url.endsWith('.obj')).get(0);
    loader.load(objUrl, m => {
      this.setState({ model: m }, cb);
    });
  }

  loadObjMtl(model, cb) {
    const loader = new OBJMTLLoader();
    const urls = model.get('urls').map(u => `/storage/models/${u}`);
    const objUrl = urls.filter(url => url.endsWith('.obj')).get(0);
    const mtlUrl = urls.filter(url => url.endsWith('mtl')).get(0);
    loader.load(objUrl, mtlUrl, m => {
      this.setState({ object: m }, cb);
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
     quaternion: state.CameraStore.get('quaternion'),
     trigger: state.CameraStore.get('trigger'),

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
