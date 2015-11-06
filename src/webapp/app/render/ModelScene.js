import Three from 'three';
import OrbitControls from './OrbitControls';

class ModelScene {
  // Renderer of the Scene
  renderer = undefined
  // The Scene
  scene = undefined
  // The Main Camera in the scene
  camera = undefined
  // The Model
  model = undefined
  // Orbit Controls
  controls = undefined
  // Data of the model
  modelData = {
    geometry: undefined,
    materials: undefined
  }
  // Current rendering state
  renderingState = {
    wireframe: false,
    shading: Three.SmoothShading
  }

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
    this.renderer = new Three.WebGLRenderer({canvas: sceneCanvas, antialias: true});
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setClearColor(0x212121);
  }

  _initScene() {
    this.scene = new Three.Scene();
  }

  _initCamera(dimensions) {
    this.camera = new Three.PerspectiveCamera(45, dimensions.aspectRatio, 0.1, 10000);
    this.scene.add(this.camera);
    this.camera.position.set(0, 450, 500);
    this.camera.lookAt(this.scene.position);
  }

  _initLight() {
    const light = new Three.PointLight(0xffffff);
    light.position.set(-100, 250, 200);
    this.scene.add(light);
  }

  _initControls(dimensions) {
    this.controls = new OrbitControls(this.camera, dimensions);
  }

  /**
   * Frame updater function
   */
  _animate = () => {
    requestAnimationFrame(this._animate);
    this._render();
  }

  /**
   * Render function which will be called for every fame
   */
  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Update the model data of the model
   * @param  {Object} modelData [the new model data mainly comprising `geometry` and `materials`]
   */
  updateModelData(modelData) {
    this.modelData = modelData;
    this._updateModel();
  }

  /**
   * Update the rendering state of the model
   * @param  {Object} state [the new state which will be merged with the existing state]
   */
  updateRenderingState(state) {
    Object.assign(this.renderingState, state);
    this._updateModel();
  }

  /**
   * Reinitialize the current model (WARN: This function should try to be called as few as possible)
   * @return {[type]} [description]
   */
  _updateModel() {
    const {geometry} = this.modelData;
    if (this.model) {
      this.scene.remove(this.model);
    }
    const materials = this._getMaterials();
    if (materials.length === 1) {
      this.model = new Three.Mesh(geometry, materials[0]);
    } else {
      this.model = Three.SceneUtils.createMultiMaterialObject(geometry, materials);
    }
    this.model.scale.set(20, 20, 20);
    this.scene.add(this.model);
  }

  /**
   * Get the materials based on the current model data and rendering state
   * @return {[Object]} [an array of material object]
   */
  _getMaterials() {
    const materials = [];
    const {wireframe, shading} = this.renderingState;
    if (this.modelData.materials) {
      materials.push(new Three.MeshFaceMaterial(this.modelData.materials.map(m => {
        m.shading = shading;
        return m;
      })));
    }

    if (wireframe) {
      materials.push(new Three.MeshBasicMaterial({
        color: 0x000000,
        shading: Three.FlatShading,
        wireframe: true,
        transparent: true
      }));
    }

    return materials;
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

  /**
   * Dispose all entities in scene
   */
  dispose() {

  }
}

export default ModelScene;
