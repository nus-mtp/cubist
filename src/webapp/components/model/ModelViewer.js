import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { ModelCanvas } from '../render';
import { RenderActions } from 'webapp/actions';

const CLASS_NAME = 'cb-model-viewer';

/**
 * Main Model Viewer to interact with model
 */
class ModelViewer extends React.Component {
  static propTypes = {
    wireframe: React.PropTypes.bool,
    shadingMode: React.PropTypes.number,
    autoRotate: React.PropTypes.bool,
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

  render() {
    return (
      <div className={ CLASS_NAME }>
        <div className="cb-relative">
          <ModelCanvas { ...this.props } />
          <div className={ `${CLASS_NAME}-options` }>
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
}

export default connect()(ModelViewer);
