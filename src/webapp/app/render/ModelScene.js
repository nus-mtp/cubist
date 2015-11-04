import {WebGLRenderer} from 'three';

class ModelScene {
  renderer = undefined;

  constructor(sceneCanvas, dimensions) {
    this.init(sceneCanvas, dimensions);
  }

  init(sceneCanvas, dimensions) {
    this.initRenderer(sceneCanvas, dimensions);
  }

  initRenderer(sceneCanvas, dimensions) {
    this.renderer = new WebGLRenderer({canvas: sceneCanvas});
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setClearColor(0x000000);
  }

  resize(dimensions) {
    this.renderer.setSize(dimensions.width, dimensions.height);
  }

  /**
   * Dispose all entities in scene
   */
  dispose() {

  }
}

export default ModelScene;
