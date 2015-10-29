import React from 'react';
import Dimensions from 'react-dimensions';
import {Vector3, Quaternion, BoxGeometry, MeshBasicMaterial, JSONLoader} from 'three';
import {
  Scene,
  PerspectiveCamera,
  Object3D,
  Mesh
} from 'react-three';

const CLASS_NAME = 'cb-model-canvas';
const aspectRatio = 16.0 / 9;

class ModelCanvas extends React.Component {
  static propTypes = {
    containerWidth: React.PropTypes.number
  }

  state = {
    quaternion: new Quaternion(),
    position: new Vector3(0, 0, 0),
    geometry: new BoxGeometry(200, 200, 200),
    material: new MeshBasicMaterial({color: '#fff'})
  }

  // This is only for testing
  componentDidMount() {
    const loader = new JSONLoader();
    loader.load('/modelAssets/android.js', (geometry) => {
      this.setState({
        geometry
      });
    });
  }

  render() {
    return (
      <div className={CLASS_NAME}>
        {process.env.BROWSER ? this.renderContent() : <canvas />}
      </div>
    );
  }

  renderContent() {
    const {containerWidth} = this.props;
    const {position, quaternion} = this.state;

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
        <Object3D quaternion={quaternion} position={position || new Vector3(0, 0, 0)}>
          <Mesh position={new Vector3(0, 0, 0)}
            scale={new Vector3(10, 10, 10)}
            geometry={this.state.geometry}
            material={this.state.material} />
        </Object3D>
      </Scene>
    );
  }
}

export default Dimensions()(ModelCanvas);
