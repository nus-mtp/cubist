import React from 'react';
import Dimensions from 'react-dimensions';
import {Vector3, BoxGeometry, MeshPhongMaterial, Color, JSONLoader} from 'three';
import {
  Scene,
  PerspectiveCamera,
  Mesh,
  AmbientLight,
  PointLight
} from 'react-three';

const CLASS_NAME = 'cb-model-canvas';
const aspectRatio = 16.0 / 9;

/**
 * Model Canvas Component
 * This is the core component for rendering the model using ThreeJS
 */
class ModelCanvas extends React.Component {
  static propTypes = {
    // Current width of the container
    containerWidth: React.PropTypes.number,
    // Indicator whether wireframe is shown
    showWireframe: React.PropTypes.bool
  }

  state = {
    geometry: new BoxGeometry(200, 200, 200),
    material: new MeshPhongMaterial({color: '#00ff00'})
  }

  // This is only for testing
  // Currently we are loading the model JSON data from the rendering server instead of storage service
  componentDidMount() {
    const loader = new JSONLoader();
    loader.load('/modelAssets/android.js', (geometry) => {
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      this.setState({
        geometry
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const material = this.state.material;
    material.wireframe = nextProps.showWireframe;
    this.setState({
      material
    });
  }

  render() {
    // Canvas content is empty on the server side
    const canvasContent = process.env.BROWSER ? this.renderContent() : <canvas />;

    return (
      <div className={CLASS_NAME}>
        {canvasContent}
      </div>
    );
  }

  renderContent() {
    const {containerWidth} = this.props;

    const cameraProps = {
      name: 'maincamera',
      fov: '75',
      aspect: aspectRatio,
      near: 1,
      far: 5000,
      position: new Vector3(0, 0, 300),
      lookat: new Vector3(0, 0, 0)
    };

    return (
      <Scene width={containerWidth} height={containerWidth / aspectRatio} camera="maincamera">
        <PerspectiveCamera {...cameraProps} />
        <Mesh position={new Vector3(0, 0, 0)}
          scale={new Vector3(10, 10, 10)}
          geometry={this.state.geometry}
          material={this.state.material} />
        <AmbientLight color={new Color(0x444444)} intensity={0.5} target={new Vector3(0, 0, 0)} />
        <PointLight color={new Color(0xFFFFFF)} intensity={2.5} position={new Vector3(0, 60, 60)} />
      </Scene>
    );
  }
}

// HOC with dimensions listener to make the rendering canvas responsive
export default Dimensions()(ModelCanvas);
