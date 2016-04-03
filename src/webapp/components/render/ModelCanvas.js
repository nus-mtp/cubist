import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Dimensions from 'react-dimensions';
import _ from 'lodash';
import Immutable from 'immutable';

import { CameraActions, SnapshotActions, WalkthroughActions, TextureLoadActions } from 'webapp/actions';
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
    resizedTexture: React.PropTypes.bool,
    containerWidth: React.PropTypes.number,
    aspectRatio: React.PropTypes.number,
    object: React.PropTypes.object,
    snapshotToken: React.PropTypes.string,
    resetViewToggle: React.PropTypes.bool,
    playbackPoints: React.PropTypes.instanceOf(Immutable.List),
    walkthroughPoints: React.PropTypes.instanceOf(Immutable.List),
    walkthroughToggle: React.PropTypes.bool,
    viewIndex: React.PropTypes.number,
    key: React.PropTypes.string
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
    // Texture Trigger
    if (nextProps.key !== this.props.key && this.modelScene) {
      this.modelScene.updateTextureState({ key: nextProps.key });
    }
    if (nextProps.resizedTexture !== this.props.resizedTexture && this.modelScene) {
      this.modelScene.updateRenderingState({ resizedTexture: nextProps.resizedTexture });
    }

    // Snapshot Trigger
    if (nextProps.snapshotToken !== this.props.snapshotToken && this.modelScene) {
      this._onSnapshotToken(nextProps.snapshotToken);
    }

    // Walkthrough Trigger
    if (nextProps.walkthroughToggle !== this.props.walkthroughToggle
      && nextProps.walkthroughToggle === true && this.modelScene) {
      this.modelScene.updateWalkthroughState({ walkthroughToggle: nextProps.walkthroughToggle,
      playbackPoints: nextProps.playbackPoints, walkthroughPoints: nextProps.walkthroughPoints });
    }
    if (nextProps.viewIndex !== this.props.viewIndex && this.modelScene) {
      const { dispatch } = this.props;
      this.modelScene.updateWalkthroughViewIndex({
        walkthroughPoints: nextProps.walkthroughPoints,
        viewIndex: nextProps.viewIndex
      });
      dispatch(WalkthroughActions.viewWalkthroughPoint(-1));
    }
    

    // this.modelScene._onPlaybackCompleted(() => {
    //   this._onPlaybackCompleted();
    // });
  }

  componentWillUnmount() {
    this.modelScene.dispose();
  }

  // _onPlaybackCompleted = (event) => {
  //   const { dispatch } = this.props;
  //   dispatch(WalkthroughActions.playbackWalkthrough());
  // };

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
    const snapshotData = ReactDOM.findDOMNode(this.refs.sceneCanvas).toDataURL();
    dispatch(SnapshotActions.snapshotSuccess(token, snapshotData));
  }

  _onPlaybackCompleted() {

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
