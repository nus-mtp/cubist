import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { ModelCanvas } from '../render';
import { RenderActions, WalkthroughActions } from 'webapp/actions';

import { DropdownButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';
import { Input } from 'react-bootstrap';

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
    cameraCoordinate: React.PropTypes.object,
    resetViewToggle: React.PropTypes.bool,
    object: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
    position: React.PropTypes.instanceOf(Immutable.Map)
  };

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

  _onWalkthroughAdd = () => {
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.addPoint());
  };

  _onWalkthroughUpdate = (e, index) => {
    const { dispatch, position } = this.props;
    const { x, y, z } = position.toJS();
    dispatch(WalkthroughActions.updatePoint(index, { x, y, z }));
  };

  _onWalkthroughDelete = (e, index) => {
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.deletePoint(index));
  };

  _onWalkthroughToggleDisjointMode = (e, index) => {
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
    dispatch(WalkthroughActions.updateAnimationDuration(index, duration));
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
        {
          walkthroughPoints.map((walkthroughPoint, index) => {
            const p = walkthroughPoint.get('pos').map(v => Number(v).toFixed(2));
            return (
              <div key={ index }>
                <h4>{ `Point ${index + 1}` }</h4>
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
                { this._renderAnimationDurationField(index, walkthroughPoint) }
              </div>
            );
          })
        }
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

  _renderAnimationDurationField(index, point) {
    const textValue = point.get('duration');

    return (
      <Input
        type="text"
        defaultValue={ textValue }
        placeholder="Enter Text"
        label="Duration"
        help="0.00 to 5.00 seconds"
        bsStyle="success"
        hasFeedback
        ref="input"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={ e => this._onWalkthroughDurationUpdate(e, index, e.target.value) } />
    );
  }
}

export default connect((state) => {
  return {
    wireframe: state.RenderStore.get('wireframe'),
    shadingMode: state.RenderStore.get('shadingMode'),
    autoRotate: state.RenderStore.get('autoRotate'),
    walkthroughPoints: state.WalkthroughStore.get('points'),
    resetViewToggle: state.RenderStore.get('resetViewToggle'),
    position: state.CameraStore.get('position'),
    up: state.CameraStore.get('up'),
    lookAt: state.CameraStore.get('lookAt'),
    zoom: state.CameraStore.get('zoom')
  };
})(ModelViewer);
