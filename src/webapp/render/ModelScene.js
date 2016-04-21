import THREE from 'three';
import _ from 'lodash';

import OrbitControls from './OrbitControls';

const SCALE_FACTOR = 40;
const SCALE_THRESHOLD = 20;
const MIN_BOUNDING_RADIUS = 0.025;
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
  // Bounding Sphere radius of model before scaling
  boundingRadius = 1;
  // Stores currently displayed objects (meshes/models)
  displayObjects = [];
  // Orbit Controls
  controls = undefined;

  canvas = undefined;

  // Current Rendering State
  renderingState = {
    wireframe: false,
    shadingMode: 0,
    resizedTexture: false,
    shading: THREE.SmoothShading
  };
  // Camera State
  cameraState = {
    autoRotate: false,
    resetView: false,
    playbackWalkthrough: false
  };

  tweenTranslate = [];
  tweenRotate = [];
  tweenLook = [];

  walkthroughState = {
    startPlayback: false,
    points: [],
    index: [0, 0],
    viewIndex: -1
  };

  modelState = {
    textures: [],
    textureStatus: 0,
    mapping: []
  };

  /**
   * Constructor function of the scene
   * @param  {DOMElement} sceneCanvas [the dom element for the canvas containing the scene]
   * @param  {Object} dimensions  [dimensions data of the canvas]
   */
  constructor(sceneCanvas, dimensions, ref) {
    this._init(sceneCanvas, dimensions);
    this.canvas = ref;
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
    this.camera = new THREE.PerspectiveCamera(45, dimensions.aspectRatio, 0.1, 100000);
    this.scene.add(this.camera);
    this.camera.position.set(0, 450, 450);
    this.camera.lookAt(this.scene.position);
  }

  _initBackground() {
    // Load background texture
    const texture = THREE.ImageUtils.loadTexture('/storage/models/background.jpg');
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
    this.frontLight = new THREE.PointLight(0xaaaaaa);
    this.frontLight.castShadow = true;
    this.camera.add(this.frontLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xaaaaaa);
    this.scene.add(ambientLight);
  }

  _initControls(dimensions) {
    this.controls = new OrbitControls(this.camera, dimensions);
  }

  _getCoordinateByIndexAndField(index, field) {
    let coordinate;
    if (field === 'position') {
      const { x, y, z } = this.walkthroughState.points[index].pos;
      coordinate = { x, y, z };
    } else if (field === 'lookAt') {
      const { x, y, z } = this.walkthroughState.points[index].lookAt;
      coordinate = { x, y, z };
    } else if (field === 'quaternion') {
      const { x, y, z, w } = this.walkthroughState.points[index].quaternion;
      coordinate = new THREE.Quaternion(x, y, z, w);
    }
    return coordinate;
  }

  _initRotationTween(index, firstIndex, nextIndex, duration) {
    const posOrigin = this._getCoordinateByIndexAndField(firstIndex, 'position');
    const posDest = this._getCoordinateByIndexAndField(nextIndex, 'position');
    const lookOrigin = this._getCoordinateByIndexAndField(firstIndex, 'lookAt');
    const lookDest = this._getCoordinateByIndexAndField(nextIndex, 'lookAt');
    const quatOrigin = this._getCoordinateByIndexAndField(firstIndex, 'quaternion');
    const quatTarget = this._getCoordinateByIndexAndField(nextIndex, 'quaternion');

    const quatResult = new THREE.Quaternion();
    const inverseOrigin = quatOrigin.inverse();
    const targetQuaternion = quatTarget.multiply(inverseOrigin);
    const curQuaternion = new THREE.Quaternion();

    const t1 = { t: 0 };
    const t2 = { t: 1 };

    const s1 = { t: 0 };
    const s2 = { t: 1 };

    this.tweenRotate[index] = new TWEEN.Tween(t1).to(t2, duration)
    .easing(TWEEN.Easing.Linear.None)
    .onStart(() => {
      this.camera.position.set(posOrigin.x, posOrigin.y, posOrigin.z);
    });

    // Tween for camera lookAt
    this.tweenLook[index] = new TWEEN.Tween(s1).to(s2, duration)
    .easing(TWEEN.Easing.Linear.None)
    .onStart(() => {
      const lookTarget = new THREE.Vector3(lookOrigin.x, lookOrigin.y, lookOrigin.z);
      this.controls.constraint.target = lookTarget;
    });

    // if Second Point is disjoint, do not UPDATE tween to next Point.
    if (this.walkthroughState.points[nextIndex].disjointMode === true ||
        this.walkthroughState.points[nextIndex].animationMode === 'Stationary') {
      this.tweenRotate[index].onComplete(() => {
        this.camera.position.set(posDest.x, posDest.y, posDest.z);
        const lookTarget = new THREE.Vector3(lookDest.x, lookDest.y, lookDest.z);
        this.controls.constraint.target = lookTarget;
        this._updateCamera();
      });
    } else {
      this.tweenRotate[index].onUpdate(() => {
        THREE.Quaternion.slerp(curQuaternion, targetQuaternion, quatResult, t1.t);

        // apply new quaternion to camera position
        const cloneOrigin = new THREE.Vector3(posOrigin.x, posOrigin.y, posOrigin.z);
        cloneOrigin.applyQuaternion(quatResult);
        this.camera.position.set(cloneOrigin.x, cloneOrigin.y, cloneOrigin.z);
      });

      this.tweenLook[index].onUpdate(() => {
        const lookVec = new THREE.Vector3(lookOrigin.x, lookOrigin.y, lookOrigin.z);
        lookVec.applyQuaternion(quatResult);
        this.controls.constraint.target = lookVec;
      });
    }
  }

  _initTranslationTween(index, firstIndex, nextIndex, duration) {
    const posOrigin = this._getCoordinateByIndexAndField(firstIndex, 'position');
    const posDest = this._getCoordinateByIndexAndField(nextIndex, 'position');
    const lookOrigin = this._getCoordinateByIndexAndField(firstIndex, 'lookAt');
    const lookDest = this._getCoordinateByIndexAndField(nextIndex, 'lookAt');

    // Tween for camera position
    this.tweenTranslate[index] = new TWEEN.Tween(posOrigin)
    .to(posDest, duration)
    .onStart(() => {
      this.camera.position.set(posOrigin.x, posOrigin.y, posOrigin.z);
    })
    .easing(TWEEN.Easing.Linear.None);

    // Tween for camera lookAt
    this.tweenLook[index] = new TWEEN.Tween(lookOrigin)
    .to(lookDest, duration)
    .onStart(() => {
      const lookTarget = new THREE.Vector3(lookOrigin.x, lookOrigin.y, lookOrigin.z);
      this.controls.constraint.target = lookTarget;
    })
    .easing(TWEEN.Easing.Linear.None);


    // if Second Point is disjoint, do not UPDATE tween to next Point.
    if (this.walkthroughState.points[nextIndex].disjointMode === true ||
        this.walkthroughState.points[nextIndex].animationMode === 'Stationary') {
      this.tweenTranslate[index].onComplete(() => {
        this.camera.position.set(posDest.x, posDest.y, posDest.z);
        const lookTarget = new THREE.Vector3(lookDest.x, lookDest.y, lookDest.z);
        this.controls.constraint.target = lookTarget;
        this._updateCamera();
      });
    } else {
      this.tweenTranslate[index].onUpdate(() => {
        this.camera.position.set(posOrigin.x, posOrigin.y, posOrigin.z);
      });
      this.tweenLook[index].onUpdate(() => {
        const lookTarget = new THREE.Vector3(lookOrigin.x, lookOrigin.y, lookOrigin.z);
        this.controls.constraint.target = lookTarget;
      });
    }
  }

  _initTween() {
    // Analyse how many Tween Obj is require
    const numTweenObjRequire = this.walkthroughState.index[1] - this.walkthroughState.index[0];

    if (numTweenObjRequire > 0) {
      TWEEN.removeAll();
      let firstIndex = this.walkthroughState.index[0];
      let nextIndex = firstIndex + 1;
      let duration;

      // Create Tween Obj
      for (let i = 0; i < numTweenObjRequire; i++) {
        if (i > 0) {
          firstIndex = nextIndex;
          nextIndex = firstIndex + 1;
        }

        duration = this.walkthroughState.points[firstIndex].duration * 1000;

        this.tweenTranslate[i] = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, duration);
        this.tweenRotate[i] = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, duration);
        this.tweenLook[i] = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, duration);

        if (this.walkthroughState.points[nextIndex].animationMode === 'Linear') {
          this._initTranslationTween(i, firstIndex, nextIndex, duration);
        } else if (this.walkthroughState.points[nextIndex].animationMode === 'Spherical') {
          this._initRotationTween(i, firstIndex, nextIndex, duration);
        } else {
          this._initTranslationTween(i, firstIndex, nextIndex, duration);
        }
      }

      // Chain up playback node
      if (numTweenObjRequire > 1) {
        for (let i = 1; i < numTweenObjRequire; i++) {
          this.tweenTranslate[i - 1].chain(this.tweenTranslate[i]);
          this.tweenRotate[i - 1].chain(this.tweenRotate[i]);
          this.tweenLook[i - 1].chain(this.tweenLook[i]);
        }
      }
    }

    if (numTweenObjRequire > 0) {
      this.tweenTranslate[0].start();
      this.tweenRotate[0].start();
      this.tweenLook[0].start();
    }

    this.tweenLook[numTweenObjRequire - 1].onComplete(() => {
      this._updateCamera();
      this.walkthroughState.startPlayback = false;
      this.canvas._onWalkthroughCompleted();
    });

    const firstIndex = this.walkthroughState.index[0];
    const { pos } = this.walkthroughState.points[firstIndex];
    const { lookAt } = this.walkthroughState.points[firstIndex];

    this.camera.position.set(pos.x, pos.y, pos.z);
    const lookTarget = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);
    this.controls.constraint.target = lookTarget;
    this._updateCamera();
  }

  _setCameraView(position, lookAt) {
    const pos = position.toJS();
    const look = lookAt.toJS();

    this.camera.position.set(pos.x, pos.y, pos.z);
    const lookTarget = new THREE.Vector3(look.x, look.y, look.z);
    this.controls.constraint.target = lookTarget;
    this._updateCamera();
  }

  _updateCamera() {
    this.getCameraOrbit();

    const coordinateFields = ['x', 'y', 'z'];
    const quaternionFields = ['x', 'y', 'z', 'w'];

    this.canvas._updateCameraProps({ position: _.pick(this.camera.position, coordinateFields),
                                       lookAt: _.pick(this.controls.constraint.target, coordinateFields),
                                       up: _.pick(this.camera.up, coordinateFields),
                                       quaternion: _.pick(this.camera.quaternion, quaternionFields) });
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

  /**
   * Update the objects (meshes/models) displayed in the scene
   */
  updateSceneObjects() {
    this.removeSceneObjects();
    this.displayObjects = this._getDisplayObjects();
    for (let i = 0; i < this.displayObjects.length; i++) {
      if (this.boundingRadius < SCALE_THRESHOLD) {
        this.displayObjects[i].scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
      }
      this.scene.add(this.displayObjects[i]);
    }
  }

  /**
   * Update the model variable of this class
   * @param  {Object} model [the new model to be displayed]
   */
  updateModel(model, boundingRadius, callback) {
    this.model = model;
    this.boundingRadius = boundingRadius < MIN_BOUNDING_RADIUS ? MIN_BOUNDING_RADIUS : boundingRadius;

    let temp = 0;
    if (boundingRadius > SCALE_THRESHOLD) {
      temp = boundingRadius;
    } else {
      temp = boundingRadius * SCALE_FACTOR;
    }
    const camPos = new THREE.Vector3(temp, temp * 3, temp * 4);
    this.controls.constraint.coordLimit = temp * 6;
    callback(this.getCameraOrbit());
    this.controls.updateFirstPosition(camPos);
    this.controls.resetView = true;
    this.updateObject();
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
    // this.controls.playbackWalkthrough = this.cameraState.playbackWalkthrough;
  }

  updateWalkthroughState(state) {
    Object.assign(this.walkthroughState, state);

    this.walkthroughState.startPlayback = state.walkthroughToggle;
    this.walkthroughState.points = this.walkthroughState.walkthroughPoints.toJS();
    this.walkthroughState.index = this.walkthroughState.playbackPoints.toJS();

    this._initTween();
  }

  updateWalkthroughViewIndex(ref, state) {
    Object.assign(this.walkthroughState, state);
    this.walkthroughState.points = this.walkthroughState.walkthroughPoints.toJS();
    this.walkthroughState.viewIndex = state.viewIndex;

    if (this.walkthroughState.viewIndex !== -1) {
      const { pos } = this.walkthroughState.points[this.walkthroughState.viewIndex];
      const { lookAt } = this.walkthroughState.points[this.walkthroughState.viewIndex];

      this.camera.position.set(pos.x, pos.y, pos.z);
      const lookTarget = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);
      this.controls.constraint.target = lookTarget;

      this._updateCamera();
    }
  }

  loadNewTexture(state, callback) {
    Object.assign(this.modelState, state);
    this.modelState.textures = this.modelState.textures;
    const textureData = this.modelState.textures;
    const pathMap = this.modelState.mapping;

    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        if (child.material.map) {
          for (let i = 0; i < pathMap.length; i++) {
            if (child.material.name === pathMap[i].matName && pathMap[i].mapType === 0) {
              child.material.map = THREE.ImageUtils.loadTexture(
                'data:image;base64,' + textureData[pathMap[i].path]
              );
              child.material.needsUpdate = true;
              break;
            }
          }
        }
        if (child.material.bumpMap) {
          for (let i = 0; i < pathMap.length; i++) {
            if (child.material.name === pathMap[i].matName && pathMap[i].mapType === 1) {
              child.material.bumpMap = THREE.ImageUtils.loadTexture(
                'data:image;base64,' + textureData[pathMap[i].path]
              );
              child.material.needsUpdate = true;
              break;
            }
          }
        }
      }
    });
    callback();
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
    * Run through all meshes in the model object
    * and update: (1) vertex normals and (2) faces to double sided
  */
  updateObject() {
    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeVertexNormals();
        child.geometry.normalsNeedUpdate = true;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
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
            transparent: true,
            side: THREE.DoubleSide
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
            transparent: true,
            side: THREE.DoubleSide
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
    const quaternionFields = ['x', 'y', 'z', 'w'];
    const lookAt = this.controls.constraint.target;

    return {
      position: _.pick(this.camera.position, coordinateFields),
      up: _.pick(this.camera.up, coordinateFields),
      lookAt: _.pick(lookAt, coordinateFields),
      quaternion: _.pick(this.camera.quaternion, quaternionFields)

    };
  }

  /**
   * Dispose all entities in scene
   */
  dispose() {

  }
}

export default ModelScene;
