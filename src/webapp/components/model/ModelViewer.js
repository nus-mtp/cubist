import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { ModelCanvas } from '../render';
import { RenderActions, WalkthroughActions } from 'webapp/actions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const CLASS_NAME = 'cb-model-viewer';

/**
 * Main Model Viewer to interact with model
 */
class ModelViewer extends React.Component {
  static propTypes = {
    wireframe: React.PropTypes.bool,
    shadingMode: React.PropTypes.number,
    autoRotate: React.PropTypes.bool,
    resizedTexture: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,
    walkthroughPoints: React.PropTypes.instanceOf(Immutable.List)
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(RenderActions.resetButtons());
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

  _onToggleTextureButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleTexture());
  };

  _onPlayWalkthroughButtonClick = () => {
    const { dispatch, walkthroughPoints } = this.props;

    dispatch(WalkthroughActions.setPlaybackStart(0));
    dispatch(WalkthroughActions.setPlaybackEnd(walkthroughPoints.count() - 1));
    dispatch(WalkthroughActions.playbackWalkthrough());
  };

  render() {
    return (
      <div className={ CLASS_NAME }>
        <div className="cb-relative">
          <ModelCanvas { ...this.props } />
          <div className={ `${CLASS_NAME}-options` }>
            { this._renderWalkthroughButton() }
            { this._renderShadingButton() }
            { this._renderAutoRotatebutton() }
            { this._renderWireframeButton() }
            { this._renderResetViewButton() }
          </div>
        </div>
      </div>
    );
  }

  _renderWireframeButton() {
    const { wireframe } = this.props;
    let tootipTitle = 'Show Wireframe';
    if (wireframe) {
      tootipTitle = 'Hide Wireframe';
    }
    const tooltip = (<Tooltip><p><strong>{ tootipTitle }</strong></p>Render Wireframe on Model</Tooltip>);
    const wireframeButtonClasses = [
      'btn',
      'btn-transparent-alt',
      `${CLASS_NAME}-wireframe-button`,
      {
        [`is-active`]: wireframe
      }
    ];

    return (
      <OverlayTrigger placement="top" overlay={ tooltip }>
        <button type="button"
          className={ classnames(wireframeButtonClasses) }
          onClick={ this._onToggleWireframeButtonClick }>
          <i className="fa fa-codepen" />
        </button>
      </OverlayTrigger>
    );
  }

  _renderAutoRotatebutton() {
    const { autoRotate } = this.props;
    const tooltip = (<Tooltip><p><strong>Auto-Rotate</strong></p>Rotate Camera Around Model</Tooltip>);
    const autoRotateButtonClasses = [
      'btn',
      'btn-transparent-alt',
      `${CLASS_NAME}-auto-rotate-button`,
      {
        [`is-active`]: autoRotate
      }
    ];

    return (
      <OverlayTrigger placement="top" overlay={ tooltip }>
        <button type="button"
          className={ classnames(autoRotateButtonClasses) }
          onClick={ this._onToggleAutoRotateButtonClick }>
          <i className="fa fa-street-view" />
        </button>
      </OverlayTrigger>
    );
  }

  _renderShadingButton() {
    const { shadingMode } = this.props;
    let buttonTitle;
    if (shadingMode === 0) {
      buttonTitle = 'Default Shading';
    } else if (shadingMode === 1) {
      buttonTitle = 'Shadeless';
    } else if (shadingMode === 2) {
      buttonTitle = 'Smooth Shading';
    } else if (shadingMode === 3) {
      buttonTitle = 'Flat Shading';
    } else {
      buttonTitle = 'NIL';
    }
    const tooltip = (<Tooltip><p><strong>Shading Mode</strong></p>Render Model with { buttonTitle }</Tooltip>);

    return (
      <OverlayTrigger placement="top" overlay={ tooltip }>
        <button type="button"
          className="btn btn-transparent-alt"
          onClick={ this._onToggleShadingButtonClick }>
          { buttonTitle }
        </button>
      </OverlayTrigger>
    );
  }

  _renderResetViewButton() {
    const buttonTitle = 'Reset View';
    const tooltip = (<Tooltip><p><strong>Reset View</strong></p>Reset Camera Back to Default Position</Tooltip>);
    const resetViewButtonClasses = [
      'btn',
      'btn-transparent-alt',
      `${CLASS_NAME}-reset-view-button`
    ];

    return (
      <OverlayTrigger placement="top" overlay={ tooltip }>
        <button type="button"
          className={ classnames(resetViewButtonClasses) }
          onClick={ this._onToggleResetViewButtonClick }>
          { buttonTitle }
        </button>
      </OverlayTrigger>
    );
  }

  _renderWalkthroughButton() {
    const { walkthroughPoints } = this.props;
    const tooltip = (<Tooltip><p><strong>Play Walkthrough</strong></p>Playback Walkthrough Path Defined by Uploader</Tooltip>);
    if (walkthroughPoints.size !== 0) {
      const buttonTitle = 'Play Walkthrough';
      const resetViewButtonClasses = [
        'btn',
        'btn-transparent-alt',
        `${CLASS_NAME}-play-walkthrough-button`
      ];

      return (
        <OverlayTrigger placement="top" overlay={tooltip}>
          <button type="button"
            className={ classnames(resetViewButtonClasses) }
            onClick={ this._onPlayWalkthroughButtonClick }>
            { buttonTitle }
          </button>
        </OverlayTrigger>
      );
    }
  }
}

export default connect()(ModelViewer);
