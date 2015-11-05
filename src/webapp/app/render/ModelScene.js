import Three from 'three';

class ModelScene {
  // Renderer of the Scene
  renderer = undefined
  // The Scene
  scene = undefined
  // The Main Camera in the scene
  camera = undefined
  // The Model
  model = undefined
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

  constructor(sceneCanvas, dimensions) {
    this.init(sceneCanvas, dimensions);
  }

  init(sceneCanvas, dimensions) {
    this.initRenderer(sceneCanvas, dimensions);
    this.initScene();
    this.initCamera(dimensions);
    this.initLight();

    this.animate();
  }

  initRenderer(sceneCanvas, dimensions) {
    this.renderer = new Three.WebGLRenderer({canvas: sceneCanvas, antialias: true});
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setClearColor(0x212121);
  }

  initScene() {
    this.scene = new Three.Scene();
  }

  initCamera(dimensions) {
    this.camera = new Three.PerspectiveCamera(45, dimensions.aspectRatio, 0.1, 10000);
    this.scene.add(this.camera);
    this.camera.position.set(0, 450, 500);
    this.camera.lookAt(this.scene.position);
  }

  initLight() {
    const light = new Three.PointLight(0xffffff);
    light.position.set(-100, 250, 200);
    this.scene.add(light);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  updateModelData(modelData) {
    this.modelData = modelData;
    this.updateModel();
  }

  updateRenderingState(state) {
    Object.assign(this.renderingState, state);
    this.updateModel();
  }

  updateModel() {
    const {geometry} = this.modelData;
    if (this.model) {
      this.scene.remove(this.model);
    }
    const materials = this.getMaterials();
    if (materials.length === 1) {
      this.model = new Three.Mesh(geometry, materials[0]);
    } else {
      this.model = Three.SceneUtils.createMultiMaterialObject(geometry, materials);
    }
    this.model.scale.set(20, 20, 20);
    this.scene.add(this.model);
  }

  getMaterials() {
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

  onResize(dimensions) {
    this.camera.aspect = dimensions.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(dimensions.width, dimensions.height);
  }

  /**
   * Dispose all entities in scene
   */
  dispose() {

  }
}

export default ModelScene;
