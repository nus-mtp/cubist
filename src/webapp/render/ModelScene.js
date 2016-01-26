import THREE from 'three';

import OrbitControls from './OrbitControls';

class ModelScene {
  // Renderer of the Scene
  renderer = undefined;
  // The Scene
  scene = undefined;
  // The Main Camera in the scene
  camera = undefined;
  // The Model
  model = undefined;
  // Stores currently displayed objects (meshes/models)
  displayObjects = [];
  // Orbit Controls
  controls = undefined;
  // Current Rendering State
  renderingState = {
    wireframe: false,
    shadingMode: 0,
    shading: THREE.SmoothShading
  };
  // Camera State
  cameraState = {
    autoRotate: false,
    resetView: false
  };

  /**
   * Constructor function of the scene
   * @param  {DOMElement} sceneCanvas [the dom element for the canvas containing the scene]
   * @param  {Object} dimensions  [dimensions data of the canvas]
   */
  constructor(sceneCanvas, dimensions) {
    this._init(sceneCanvas, dimensions);
  }

  _init(sceneCanvas, dimensions) {
    this._initRenderer(sceneCanvas, dimensions);
    this._initScene();
    this._initCamera(dimensions);
    this._initLight();
    this._initControls(dimensions);

    this._animate();
  }

  _initRenderer(sceneCanvas, dimensions) {
    this.renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas, antialias: true });
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setClearColor(0x212121);
  }

  _initScene() {
    this.scene = new THREE.Scene();
  }

  _initCamera(dimensions) {
    this.camera = new THREE.PerspectiveCamera(45, dimensions.aspectRatio, 0.1, 10000);
    this.scene.add(this.camera);
    this.camera.position.set(0, 450, 500);
    this.camera.lookAt(this.scene.position);
  }

  _initLight() {
    // Main front light
    const light = new THREE.PointLight(0xdddddd);
    light.position.set(-100, 250, 200);
    light.castShadow = true;
    this.scene.add(light);

    // Fill light
    const light2 = new THREE.PointLight(0x777777);
    light2.position.set(100, 100, 200);
    this.scene.add(light2);

    // Back light
    const light3 = new THREE.PointLight(0x777777);
    light3.position.set(0, 100, -200);
    this.scene.add(light3);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    this.scene.add(ambientLight);
  }

  _initControls(dimensions) {
    this.controls = new OrbitControls(this.camera, dimensions);
  }

  /**
   * Frame updater function
   */
  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.controls.update();
    this._render();
  }

  /**
   * Render function which will be called for every fame
   */
  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Update the objects (meshes/models) displayed in the scene
   */
  updateSceneObjects() {
    this.removeSceneObjects();
    this.displayObjects = this._getDisplayObjects();
    for (let i = 0; i < this.displayObjects.length; i++) {
      this.displayObjects[i].scale.set(40, 40, 40);
      this.displayObjects[i].position.y = -20;
      this.scene.add(this.displayObjects[i]);
    }
  }

  /**
   * Update the model variable of this class
   * @param  {Object} model [the new model to be displayed]
   */
  updateModel(model) {
    this.model = model;
    this.updateSceneObjects();
  }

  /**
   * Update the rendering state of the model
   * @param  {Object} state [the new state which will be merged with the existing state]
   */
  updateRenderingState(state) {
    Object.assign(this.renderingState, state);
    this.updateSceneObjects();
  }

  updateCameraState(state) {
    Object.assign(this.cameraState, state);
    this.controls.resetView = this.cameraState.resetView;
    this.controls.autoRotate = this.cameraState.autoRotate;
  }

  /**
   * Remove objects (models/meshes) currently displayed in the scene
   */
  removeSceneObjects() {
    for (let i = 0; i < this.displayObjects.length; i++) {
      this.scene.remove(this.displayObjects[i]);
    }
  }

  /**
   * Get the objects to display based on this.model and rendering state
   */
  _getDisplayObjects() {
    const objects = [];
    const { wireframe, shadingMode } = this.renderingState;
    if (shadingMode === 0) {
      objects.push(this.model);
    }
    if (shadingMode === 1) {
      this.model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          const newMesh = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
            color: 0xc0c0c0,
            shading: THREE.FlatShading,
            wireframe: false,
            transparent: true
          }));
          objects.push(newMesh);
        }
      });
    }
    if (shadingMode === 2) {
      this.model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          const newMesh = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
            color: 0xc0c0c0,
            shading: THREE.SmoothShading,
            wireframe: false,
            transparent: true
          }));
          objects.push(newMesh);
        }
      });
    }

    if (wireframe) {
      this.model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          const newMesh = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
            color: 0x00e0c0,
            shading: THREE.FlatShading,
            wireframe: true,
            transparent: true
          }));
          objects.push(newMesh);
        }
      });
    }
    return objects;
  }

  /**
   * Handler function for the scene when the scene dimensions are modified
   * @param  {Object} dimensions [data of the scene dimensions]
   */
  onResize(dimensions) {
    this.camera.aspect = dimensions.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.controls.setDimensions(dimensions.width, dimensions.height);
  }

  onMouseDown(event, callback) {
    this.controls.onMouseDown(event);
    callback(this.getCameraOrbit());
  }

  onMouseMove(event, callback) {
    this.controls.onMouseMove(event);
    callback(this.getCameraOrbit());
  }

  onMouseUp(event, callback) {
    this.controls.onMouseUp(event);
    callback(this.getCameraOrbit());
  }

  onWheel(event, callback) {
    this.controls.onMouseWheel(event);
    callback(this.getCameraOrbit());
  }

  getCameraOrbit() {
    const lookAt = new THREE.Vector3(0, 0, -1);
    lookAt.applyMatrix4(this.camera.matrixWorld);
    return {
      position: this.camera.position,
      up: this.camera.up,
      lookAt,
      zoom: this.camera.zoom
    };
  }

  /**
   * Dispose all entities in scene
   */
  dispose() {

  }
}

export default ModelScene;
