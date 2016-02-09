import THREE from 'three';
import _ from 'lodash';

import OrbitControls from './OrbitControls';

let TWEEN;
if (process.env.BROWSER) {
  TWEEN = require('tween.js');
}

class ModelScene {
  // Renderer of the Scene
  renderer = undefined;
  // The Scene
  scene = undefined;
  // The Main Camera in the scene
  camera = undefined;
  // The main front light
  frontLight = undefined;
  // Background scene and camera
  backgroundScene = undefined;
  backgroundCamera = undefined;
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
    resetView: false,
    playbackWalkthrough: false
  };

  tweenList = [];

  walkthroughState = {
    startPlayback: false,
    points: [],
    index: [0, 0]
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
    this._initBackground();
    this._initLight();
    this._initControls(dimensions);

    this._animate();
  }

  _initRenderer(sceneCanvas, dimensions) {
    this.renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setClearColor(0x212121, 0); // Alpha value set to 0 for transparancy
    this.renderer.autoClear = false;
  }

  _initScene() {
    this.scene = new THREE.Scene();
  }

  _initCamera(dimensions) {
    this.camera = new THREE.PerspectiveCamera(45, dimensions.aspectRatio, 0.1, 10000);
    this.scene.add(this.camera);
    this.camera.position.set(0, 450, 450);
    this.camera.lookAt(this.scene.position);
  }

  _initBackground() {
    // Load background texture
    const texture = THREE.ImageUtils.loadTexture('/models/background.jpg');
    const backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 0),
      new THREE.MeshBasicMaterial({
        map: texture
      }));
    // Turn off any depth checking
    backgroundMesh.material.depthTest = false;
    backgroundMesh.material.depthWrite = false;
    // Create the background scene
    this.backgroundScene = new THREE.Scene();
    this.backgroundCamera = new THREE.Camera();
    this.backgroundScene.add(this.backgroundCamera);
    this.backgroundScene.add(backgroundMesh);
  }

  _initLight() {
    // Main front light
    this.frontLight = new THREE.PointLight(0xdddddd);
    this.frontLight.castShadow = true;
    this.camera.add(this.frontLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x444444);
    this.scene.add(ambientLight);
  }

  _initControls(dimensions) {
    this.controls = new OrbitControls(this.camera, dimensions);
  }

  _initTween() {
// Analyse how many Tween Obj is require
    const numTweenObjRequire = this.walkthroughState.index[1] - this.walkthroughState.index[0];

    if (numTweenObjRequire > 0) {
      TWEEN.removeAll();
      let firstIndex = this.walkthroughState.index[0];
      let nextIndex;
      let duration;
      let destination;

      // Create Tween Obj
      for (let i = 0; i < numTweenObjRequire; i++) {
        firstIndex = firstIndex + i;
        nextIndex = firstIndex + 1;

        const xOrigin = this.walkthroughState.points[firstIndex].pos.x;
        const yOrigin = this.walkthroughState.points[firstIndex].pos.y;
        const zOrigin = this.walkthroughState.points[firstIndex].pos.z;
        const origin = { x: xOrigin, y: yOrigin, z: zOrigin };

        duration = this.walkthroughState.points[firstIndex].duration * 1000;

        const xDest = this.walkthroughState.points[nextIndex].pos.x;
        const yDest = this.walkthroughState.points[nextIndex].pos.y;
        const zDest = this.walkthroughState.points[nextIndex].pos.z;
        destination = { x: xDest, y: yDest, z: zDest };

        this.tweenList[i] = new TWEEN.Tween(origin)
        .to(destination, duration)
        .easing(TWEEN.Easing.Linear.None);

        // if Second Point is disjoint, do not UPDATE tween to next Point.
        if (this.walkthroughState.points[nextIndex].disjointMode === true) {
          this.tweenList[i].onStart(() => {
            this.camera.position.set(origin.x, origin.y, origin.z);
          })
          .onComplete(() => {
            this.camera.position.set(destination.x, destination.y, destination.z);
          });
        } else {
          this.tweenList[i].onUpdate(() => {
            this.camera.position.set(origin.x, origin.y, origin.z);
          });
        }

        firstIndex = 0;
      }

      // Chain up playback node
      if (numTweenObjRequire > 1) {
        for (let i = 1; i < numTweenObjRequire; i++) {
          this.tweenList[i - 1].chain(this.tweenList[i]);
        }
      }
    }

    // const lastTweenIndex = this.tweenList.length;
    // this.tweenList[lastTweenIndex - 1].onComplete(() => {
    //   console.log('Complete');
    //   this._toggleStartPlayback();
    // });

    if (numTweenObjRequire > 0) {
      this.tweenList[0].start();
    }
  }


  /**
   * Frame updater function
   */
  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.controls.update();
    this._render();

    if (this.walkthroughState.startPlayback) {
      TWEEN.update();
    }
  }

  /**
   * Render function which will be called for every fame
   */
  _render() {
    this.renderer.clear();
    // Render background first so that the model appears in front
    this.renderer.render(this.backgroundScene, this.backgroundCamera);
    this.renderer.render(this.scene, this.camera);
  }

  _toggleStartPlayback() {
    this.walkthroughState.startPlayback = !this.walkthroughState.startPlayback;

    // return {
    //   walkthroughToggle: this.walkthroughState.startPlayback
    // };
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
    this.updateObjectVertexNormals();
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
    this.cameraState.resetView = false;
    this.controls.playbackWalkthrough = this.cameraState.playbackWalkthrough;
  }

  updateWalkthroughState(state) {
    Object.assign(this.walkthroughState, state);
    this.walkthroughState.startPlayback = state.walkthroughToggle;
    this.walkthroughState.points = this.walkthroughState.walkthroughPoints.toJS();
    this.walkthroughState.index = this.walkthroughState.playbackPoints.toJS();

    this._initTween();
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
    * Run through all meshes in the model object and have threejs calculate their vertex normals
  */
  updateObjectVertexNormals() {
    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeVertexNormals();
        child.geometry.normalsNeedUpdate = true;
      }
    });
  }
  /**
   * Get the objects to display based on this.model and rendering state
   */
  _getDisplayObjects() {
    const objects = [];
    const { wireframe, shadingMode } = this.renderingState;
    // Default Shading Mode
    if (shadingMode === 0 || 1) {
      objects.push(this.model);
    }
    // Shadeless Mode - turn lights off in shadeless mode
    if (shadingMode === 1) {
      this.frontLight.visible = false;
    } else {
      this.frontLight.visible = true;
    }
    // Smooth Shading mode
    if (shadingMode === 2) {
      this.model.traverse(child => {
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
    // Flat Shading mode
    if (shadingMode === 3) {
      this.model.traverse(child => {
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

    if (wireframe) {
      this.model.traverse(child => {
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
    this.controls.setDimensions(dimensions);
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
    const coordinateFields = ['x', 'y', 'z'];
    const lookAt = new THREE.Vector3(0, 0, -1);
    lookAt.applyMatrix4(this.camera.matrixWorld);
    return {
      position: _.pick(this.camera.position, coordinateFields),
      up: _.pick(this.camera.up, coordinateFields),
      lookAt: _.pick(this.camera.lookAt, coordinateFields)
    };
  }

  /**
   * Dispose all entities in scene
   */
  dispose() {

  }
}

export default ModelScene;
