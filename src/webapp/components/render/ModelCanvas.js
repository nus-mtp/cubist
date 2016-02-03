import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Dimensions from 'react-dimensions';
import _ from 'lodash';

import { CameraActions, SnapshotActions } from 'webapp/actions';
import ModelScene from '../../render/ModelScene';

const CLASS_NAME = 'cb-model-canvas';

/**
 * Model Canvas Component
 * This is the core component for rendering the model using ThreeJS
 */
class ModelCanvas extends React.Component {
  static propTypes = {
    // Current width of the container
    dispatch: React.PropTypes.func,
    wireframe: React.PropTypes.bool,
    shadingMode: React.PropTypes.number,
    autoRotate: React.PropTypes.bool,
    containerWidth: React.PropTypes.number,
    aspectRatio: React.PropTypes.number,
    object: React.PropTypes.object,
    snapshotToken: React.PropTypes.string,
    resetViewToggle: React.PropTypes.bool,
    playbackWalkthroughToggle: React.PropTypes.bool
  };

  static defaultProps = {
    containerWidth: 500,
    aspectRatio: 16.0 / 9,
    object: {}
  };

  componentDidMount() {
    const { containerWidth, aspectRatio } = this.props;
    this.modelScene = new ModelScene(ReactDOM.findDOMNode(this.refs.sceneCanvas), {
      width: containerWidth,
      height: Math.floor(containerWidth / aspectRatio),
      aspectRatio
    });
  }

  componentWillReceiveProps(nextProps) {
    // Update container width
    if (nextProps.containerWidth !== this.props.containerWidth) {
      const { containerWidth, aspectRatio } = nextProps;
      this.modelScene.onResize({
        width: containerWidth,
        height: Math.floor(containerWidth / aspectRatio),
        aspectRatio
      });
    }
    // Update model
    if (nextProps.object !== this.props.object && this.modelScene) {
      this.modelScene.updateModel(nextProps.object);
    }
    // Update rendering state
    if (nextProps.wireframe !== this.props.wireframe && this.modelScene) {
      this.modelScene.updateRenderingState({ wireframe: nextProps.wireframe });
    }
    if (nextProps.shadingMode !== this.props.shadingMode && this.modelScene) {
      this.modelScene.updateRenderingState({ shadingMode: nextProps.shadingMode });
    }
    if (nextProps.autoRotate !== this.props.autoRotate && this.modelScene) {
      this.modelScene.updateCameraState({ autoRotate: nextProps.autoRotate });
    }
    if (nextProps.resetViewToggle !== this.props.resetViewToggle && this.modelScene) {
      this.modelScene.updateCameraState({ resetView: true });
    }

    // Snapshot Trigger
    if (nextProps.snapshotToken !== this.props.snapshotToken && this.modelScene) {
      this._onSnapshotToken(nextProps.snapshotToken);
    }

    // Walkthrough Playback Trigger
    if (nextProps.playbackWalkthroughToggle !== this.props.playbackWalkthroughToggle && this.modelScene) {
      this.modelScene.updateCameraState({ playbackWalkthrough: true });
    }
  }

  componentWillUnmount() {
    this.modelScene.dispose();
  }

  _onCameraOrbit(camera) {
    const { dispatch } = this.props;
    dispatch(CameraActions.orbitCamera(camera));
  }

  _onCameraOrbitThrottle = _.throttle(this._onCameraOrbit.bind(this), 100);

  _onMouseDown = (event) => {
    if (this.modelScene) {
      this.modelScene.onMouseDown(event, this._onCameraOrbitThrottle);
    }
  };

  _onMouseMove = (event) => {
    if (this.modelScene) {
      this.modelScene.onMouseMove(event, this._onCameraOrbitThrottle);
    }
  };

  _onMouseUp = (event) => {
    if (this.modelScene) {
      this.modelScene.onMouseUp(event, this._onCameraOrbitThrottle);
    }
  };

  _onWheel = (event) => {
    if (this.modelScene) {
      this.modelScene.onWheel(event, this._onCameraOrbitThrottle);
    }
  };

  _onContextMenu = (event) => {
    event.preventDefault();
  };

  _onSnapshotToken(token) {
    const { dispatch } = this.props;
    // Snapshot Data Computation Logic
    const snapshotData = undefined;
    dispatch(SnapshotActions.snapshotSuccess(token, snapshotData));
  }

  render() {
    const { containerWidth, aspectRatio } = this.props;
    const canvasStyle = {
      width: `${containerWidth}px`,
      height: `${Math.floor(containerWidth / aspectRatio)}px`
    };

    return (
      <div className={ CLASS_NAME }>
        <canvas className={ `${CLASS_NAME}-content` }
          style={ canvasStyle }
          onMouseDown={ this._onMouseDown }
          onMouseMove={ this._onMouseMove }
          onMouseUp={ this._onMouseUp }
          onWheel={ this._onWheel }
          onContextMenu={ this._onContextMenu }
          ref="sceneCanvas" />
      </div>
    );
  }
}

// HOC with dimensions listener to make the rendering canvas responsive
export default connect()(Dimensions()(ModelCanvas));
