import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { DropdownButton, MenuItem, SplitButton } from 'react-bootstrap';
import { batchActions } from 'redux-batched-actions';

import { ModelCanvas } from '../render';
import { RenderActions, WalkthroughActions, SnapshotActions } from 'webapp/actions';
import { StringHelper } from 'common';

const CLASS_NAME = 'cb-model-viewer';

/**
 * Main Model Viewer to interact with model
 */
class ModelViewer extends React.Component {
  static propTypes = {
    wireframe: React.PropTypes.bool,
    shadingMode: React.PropTypes.number,
    autoRotate: React.PropTypes.bool,
    modelData: React.PropTypes.object,
    walkthroughPoints: React.PropTypes.instanceOf(Immutable.List),
    playbackPoints: React.PropTypes.instanceOf(Immutable.List),
    walkthroughToggle: React.PropTypes.bool,
    cameraCoordinate: React.PropTypes.object,
    resetViewToggle: React.PropTypes.bool,
    object: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
    position: React.PropTypes.instanceOf(Immutable.Map),
    snapshots: React.PropTypes.instanceOf(Immutable.Map)
  };

  constructor(props) {
    super(props);

    this.state = {
      durations: props.walkthroughPoints.map(p => p.get('duration'))
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.walkthroughPoints !== this.props.walkthroughPoints) {
      this.setState({
        durations: nextProps.walkthroughPoints.map(p => p.get('duration')).toJS()
      });
    }
  }

  _onToggleWireframeButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleWireframe());
  };

  _onToggleShadingButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleShading());
  };

  _onToggleAutoRotateButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleAutoRotate());
  };

  _onToggleResetViewButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleResetView());
  };

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

  render() {
    return (
      <div className={ CLASS_NAME }>
        <div style={ { position: 'relative' } }>
          <ModelCanvas { ...this.props } />
          <div className={ `${CLASS_NAME}-options` }>
            { this._renderShadingButton() }
            { this._renderAutoRotatebutton() }
            { this._renderWireframeButton() }
            { this._renderResetViewButton() }
          </div>
        </div>
        <div>
          { this._renderWalkthroughPlaybackSection() }
          { this._renderWalkthroughSection() }
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
                  <h3>{ `Point ${index + 1}` }</h3>
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

  _renderWalkthroughPlaybackSection() {
    const { walkthroughPoints, playbackPoints } = this.props;
    const startIndex = playbackPoints.first();
    const endIndex = playbackPoints.last();

    if (walkthroughPoints.count() > 0) {
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
          <button className="btn btn-primary" onClick={ e => this._onWalkthroughPlayback(e) } >
          Play Walkthrough
          </button>
        </p>
        </div>
      );
    }
  }

  _renderWireframeButton() {
    const { wireframe } = this.props;
    const wireframeButtonClasses = [
      'btn',
      'btn-transparent-alt',
      `${CLASS_NAME}-wireframe-button`,
      {
        [`is-active`]: wireframe
      }
    ];

    return (
      <button type="button"
        className={ classnames(wireframeButtonClasses) }
        onClick={ this._onToggleWireframeButtonClick }>
        <i className="fa fa-codepen" />
      </button>
    );
  }

  _renderAutoRotatebutton() {
    const { autoRotate } = this.props;
    const autoRotateButtonClasses = [
      'btn',
      'btn-transparent-alt',
      `${CLASS_NAME}-auto-rotate-button`,
      {
        [`is-active`]: autoRotate
      }
    ];

    return (
      <button type="button"
        className={ classnames(autoRotateButtonClasses) }
        onClick={ this._onToggleAutoRotateButtonClick }>
        <i className="fa fa-street-view" />
      </button>
    );
  }

  _renderShadingButton() {
    const { shadingMode } = this.props;
    let buttonTitle;
    if (shadingMode === 0) {
      buttonTitle = 'Default';
    } else if (shadingMode === 1) {
      buttonTitle = 'Shadeless';
    } else if (shadingMode === 2) {
      buttonTitle = 'Smooth';
    } else if (shadingMode === 3) {
      buttonTitle = 'Flat';
    } else {
      buttonTitle = 'NIL';
    }

    return (
      <button type="button"
        className="btn btn-transparent-alt"
        onClick={ this._onToggleShadingButtonClick }>
        { buttonTitle }
      </button>
    );
  }

  _renderResetViewButton() {
    const buttonTitle = 'Reset View';
    const resetViewButtonClasses = [
      'btn',
      'btn-transparent-alt',
      `${CLASS_NAME}-reset-view-button`
    ];

    return (
      <button type="button"
        className={ classnames(resetViewButtonClasses) }
        onClick={ this._onToggleResetViewButtonClick }>
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
}

export default connect()(ModelViewer);
