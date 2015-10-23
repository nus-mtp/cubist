import React from 'react';
import {Vector3, Quaternion, BoxGeometry, MeshBasicMaterial} from 'three';
import {
  Scene,
  PerspectiveCamera,
  Object3D,
  Mesh
} from 'react-three';

const CLASS_NAME = 'cb-model-canvas';

class ModelCanvas extends React.Component {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  state = {
    quaternion: new Quaternion(),
    position: new Vector3(0, 0, 0)
  }

  render() {
    if (!process.env.BROWSER) {
      return (
        <div>
        </div>
      );
    }
    const {width, height} = this.props;
    const {position, quaternion} = this.state;

    const cameraProps = {
      name: 'maincamera',
      fov: '75',
      aspect: width / height,
      near: 1,
      far: 5000,
      position: new Vector3(0, 0, 600),
      lookat: new Vector3(0, 0, 0)
    };

    return (
      <div className={CLASS_NAME}>
        <Scene width={width} height={height} camera="maincamera">
          <PerspectiveCamera {...cameraProps} />
          <Object3D quaternion={quaternion} position={position || new Vector3(0, 0, 0)}>
            <Mesh position={new Vector3(0, -100, 0)}
              geometry={new BoxGeometry(200, 200, 200)}
              material={new MeshBasicMaterial({color: '#fff'})}/>
            <Mesh position={new Vector3(0, 100, 0)}
              geometry={new BoxGeometry(200, 200, 200)}
              material={new MeshBasicMaterial({color: '#fff'})}/>
          </Object3D>
        </Scene>
      </div>
    );
  }
}

export default ModelCanvas;
