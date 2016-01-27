import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { ModelCanvas } from '../render';
import { RenderActions, WalkthroughActions } from 'webapp/actions';

import { DropdownButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

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
    dispatch: React.PropTypes.func.isRequired
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
    const { dispatch } = this.props;
    dispatch(WalkthroughActions.updatePoint(index, [10, 10, 10]));
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
    const { walkthroughPoints } = this.props;

    return (
      <div>
        <h3>Current Camera Coordinate:</h3>
        <p>{ '10, 10, 10' }</p>
        {
          walkthroughPoints.map((point, index) => (
            <div key={ index }>
                <h4>{ `Point ${index + 1}` }</h4>
                <p>{ `${point.get('posX')}, ${point.get('posY')}, ${point.get('posZ')}` }</p>
                <button className="btn btn-primary" onClick={ e => this._onWalkthroughUpdate(e, index) } >
                  SET
                </button>
                <button className="btn btn-danger" onClick={ e => this._onWalkthroughDelete(e, index) } >
                  DELETE
                </button>
                { this._renderWalkthroughToggleDisjointButton(index, point.get('disjointMode')) }
                { this._renderWalkthroughAnimationDropdown(index, point) }
            </div>
          ))
        }
        <button className="btn btn-success" onClick={ this._onWalkthroughAdd }>
          ADD NEW POINT
        </button>
      </div>
    );
  }

  _renderWalkthroughAnimationDropdown(index, point) {
    const disjointMode = point.get('disjointMode');
    let buttonTitle;
    buttonTitle = point.get('animationMode');

    if (disjointMode) {
      return this._renderDisjointDropdownMenu(index, point);
    } else {
      return this._renderContinuousDropdownMenu(index, point);
    }
  }

  _renderDisjointDropdownMenu(index, point) {
    let buttonTitle;
    buttonTitle = point.get('animationMode');

    return (
        <DropdownButton bsStyle="info" title={ buttonTitle } id="dropdown-basic-info">
          <MenuItem eventKey="1" onClick={ e => this._onWalkthroughAnimation(e, index, 'Stationary') } >Stationary</MenuItem>
        </DropdownButton>
    );
  }

  _renderContinuousDropdownMenu(index, point) {
    let buttonTitle;
    buttonTitle = point.get('animationMode');

    return (
        <DropdownButton bsStyle="info" title={ buttonTitle } id="dropdown-basic-info">
          <MenuItem eventKey="1" onClick={ e => this._onWalkthroughAnimation(e, index, 'Stationary') } >Stationary</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="2" onClick={ e => this._onWalkthroughAnimation(e, index, 'Translation') } >Translation</MenuItem>
          <MenuItem eventKey="3" onClick={ e => this._onWalkthroughAnimation(e, index, 'Rotation') } >Rotation</MenuItem>
          <MenuItem eventKey="4" onClick={ e => this._onWalkthroughAnimation(e, index, 'Zooming') } >Zooming</MenuItem>
          <MenuItem eventKey="5" onClick={ e => this._onWalkthroughAnimation(e, index, 'Translation + Rotation') } >Translation + Rotation</MenuItem>
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
      <button className="btn btn-warning" onClick={ e => this._onWalkthroughToggleDisjointMode(e, index) } disabled={ disableStatus }>
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
      buttonTitle = 'Flat';
    } else {
      buttonTitle = 'Smooth';
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
}


export default connect((state) => {
  return {
    wireframe: state.RenderStore.get('wireframe'),
    shadingMode: state.RenderStore.get('shadingMode'),
    autoRotate: state.RenderStore.get('autoRotate'),
    walkthroughPoints: state.WalkthroughStore.get('points')
  };
})(ModelViewer);
