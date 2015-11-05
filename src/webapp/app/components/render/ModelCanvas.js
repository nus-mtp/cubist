import React from 'react';
import ReactDOM from 'react-dom';
import Dimensions from 'react-dimensions';

import ModelScene from '../../render/ModelScene';

const CLASS_NAME = 'cb-model-canvas';

/**
 * Model Canvas Component
 * This is the core component for rendering the model using ThreeJS
 */
class ModelCanvas extends React.Component {
  static propTypes = {
    // Current width of the container
    showWireframe: React.PropTypes.bool,
    containerWidth: React.PropTypes.number,
    aspectRatio: React.PropTypes.number,
    modelData: React.PropTypes.object
  }

  static defaultProps = {
    containerWidth: 500,
    aspectRatio: 16.0 / 9,
    modelData: {}
  }

  componentDidMount() {
    const {containerWidth, aspectRatio} = this.props;
    this.modelScene = new ModelScene(ReactDOM.findDOMNode(this.refs.sceneCanvas), {
      width: containerWidth,
      height: Math.floor(containerWidth / aspectRatio),
      aspectRatio
    });
  }

  componentWillReceiveProps(nextProps) {
    // Update container width
    if (nextProps.containerWidth !== this.props.containerWidth) {
      const {containerWidth, aspectRatio} = nextProps;
      this.modelScene.onResize({
        width: containerWidth,
        height: Math.floor(containerWidth / aspectRatio),
        aspectRatio
      });
    }
    // Update model
    if (nextProps.modelData !== this.props.modelData) {
      this.modelScene.updateModelData(nextProps.modelData);
    }
    // Update rendering state
    if (nextProps.showWireframe !== this.props.showWireframe) {
      this.modelScene.updateRenderingState({wireframe: nextProps.showWireframe});
    }
  }

  componentWillUnmount() {
    this.modelScene.dispose();
  }

  render() {
    const {containerWidth, aspectRatio} = this.props;
    const canvasStyle = {
      width: `${containerWidth}px`,
      height: `${Math.floor(containerWidth / aspectRatio)}px`
    };

    return (
      <div className={CLASS_NAME}>
        <canvas className={`${CLASS_NAME}-content`} style={canvasStyle} ref="sceneCanvas" />
      </div>
    );
  }
}

// HOC with dimensions listener to make the rendering canvas responsive
export default Dimensions()(ModelCanvas);
