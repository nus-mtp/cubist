import THREE from 'three';
import _ from 'lodash';

import OrbitControls from './OrbitControls';

const TEXTURE_SUFFIX = '_small';
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

  _initRotationTween(index, firstIndex, nextIndex, duration) {
    const xOrigin = this.walkthroughState.points[firstIndex].pos.x;
    const yOrigin = this.walkthroughState.points[firstIndex].pos.y;
    const zOrigin = this.walkthroughState.points[firstIndex].pos.z;

    const xDest = this.walkthroughState.points[nextIndex].pos.x;
    const yDest = this.walkthroughState.points[nextIndex].pos.y;
    const zDest = this.walkthroughState.points[nextIndex].pos.z;

    const qm = new THREE.Quaternion();

    const quatOrigin = new THREE.Quaternion(this.walkthroughState.points[firstIndex].quaternion.x,
                                            this.walkthroughState.points[firstIndex].quaternion.y,
                                            this.walkthroughState.points[firstIndex].quaternion.z,
                                            this.walkthroughState.points[firstIndex].quaternion.w);
    const quatTarget = new THREE.Quaternion(this.walkthroughState.points[nextIndex].quaternion.x,
                                            this.walkthroughState.points[nextIndex].quaternion.y,
                                            this.walkthroughState.points[nextIndex].quaternion.z,
                                            this.walkthroughState.points[nextIndex].quaternion.w);
    const inverseOrigin = quatOrigin.inverse();
    const targetQuaternion = quatTarget.multiply(inverseOrigin);
    const curQuaternion = new THREE.Quaternion();

    const xOrig = this.walkthroughState.points[firstIndex].lookAt.x;
    const yOrig = this.walkthroughState.points[firstIndex].lookAt.y;
    const zOrig = this.walkthroughState.points[firstIndex].lookAt.z;

    const xDestL = this.walkthroughState.points[nextIndex].lookAt.x;
    const yDestL = this.walkthroughState.points[nextIndex].lookAt.y;
    const zDestL = this.walkthroughState.points[nextIndex].lookAt.z;
    const destL = new THREE.Vector3(xDestL, yDestL, zDestL);

    const t1 = { t: 0 };
    const t2 = { t: 1 };

    const s1 = { t: 0 };
    const s2 = { t: 1 };

    this.tweenRotate[index] = new TWEEN.Tween(t1).to(t2, duration)
    .easing(TWEEN.Easing.Linear.None)
    .onStart(() => {
      this.camera.position.set(xOrigin, yOrigin, zOrigin);
    });

    // Tween for camera lookAt
    this.tweenLook[index] = new TWEEN.Tween(s1).to(s2, duration)
    .easing(TWEEN.Easing.Linear.None)
    .onStart(() => {
      const lookTarget = new THREE.Vector3(xOrig, yOrig, zOrig);
      this.controls.constraint.target = lookTarget;
    });

    // if Second Point is disjoint, do not UPDATE tween to next Point.
    if (this.walkthroughState.points[nextIndex].disjointMode === true ||
        this.walkthroughState.points[nextIndex].animationMode === 'Stationary') {
      this.tweenRotate[index].onComplete(() => {
        this.camera.position.set(xDest, yDest, zDest);
        const lookTarget = new THREE.Vector3(destL.x, destL.y, destL.z);
        this.controls.constraint.target = lookTarget;
      });
    } else {
      this.tweenRotate[index].onUpdate(() => {
        THREE.Quaternion.slerp(curQuaternion, targetQuaternion, qm, t1.t);

        // apply new quaternion to camera position
        const cloneOrigin = new THREE.Vector3(xOrigin, yOrigin, zOrigin);
        cloneOrigin.applyQuaternion(qm);
        this.camera.position.set(cloneOrigin.x, cloneOrigin.y, cloneOrigin.z);
      });

      this.tweenLook[index].onUpdate(() => {
        const lookVec = new THREE.Vector3(xOrig, yOrig, zOrig);
        lookVec.applyQuaternion(qm);
        this.controls.constraint.target = lookVec;
      });
    }
  }

  _initTranslationTween(index, firstIndex, nextIndex, duration) {
    const xOrigin = this.walkthroughState.points[firstIndex].pos.x;
    const yOrigin = this.walkthroughState.points[firstIndex].pos.y;
    const zOrigin = this.walkthroughState.points[firstIndex].pos.z;
    const origin = { x: xOrigin, y: yOrigin, z: zOrigin };

    const xDest = this.walkthroughState.points[nextIndex].pos.x;
    const yDest = this.walkthroughState.points[nextIndex].pos.y;
    const zDest = this.walkthroughState.points[nextIndex].pos.z;
    const destination = { x: xDest, y: yDest, z: zDest };

    const xOrig = this.walkthroughState.points[firstIndex].lookAt.x;
    const yOrig = this.walkthroughState.points[firstIndex].lookAt.y;
    const zOrig = this.walkthroughState.points[firstIndex].lookAt.z;
    const originLook = { x: xOrig, y: yOrig, z: zOrig };

    const xDestL = this.walkthroughState.points[nextIndex].lookAt.x;
    const yDestL = this.walkthroughState.points[nextIndex].lookAt.y;
    const zDestL = this.walkthroughState.points[nextIndex].lookAt.z;
    const destL = { x: xDestL, y: yDestL, z: zDestL };

    // Tween for camera position
    this.tweenTranslate[index] = new TWEEN.Tween(origin)
    .to(destination, duration)
    .onStart(() => {
      this.camera.position.set(origin.x, origin.y, origin.z);
    })
    .easing(TWEEN.Easing.Linear.None);

    // Tween for camera lookAt
    this.tweenLook[index] = new TWEEN.Tween(originLook)
    .to(destL, duration)
    .onStart(() => {
      const lookTarget = new THREE.Vector3(originLook.x, originLook.y, originLook.z);
      this.controls.constraint.target = lookTarget;
    })
    .easing(TWEEN.Easing.Linear.None);


    // if Second Point is disjoint, do not UPDATE tween to next Point.
    if (this.walkthroughState.points[nextIndex].disjointMode === true ||
        this.walkthroughState.points[nextIndex].animationMode === 'Stationary') {
      this.tweenTranslate[index].onComplete(() => {
        this.camera.position.set(destination.x, destination.y, destination.z);
        const lookTarget = new THREE.Vector3(destL.x, destL.y, destL.z);
        this.controls.constraint.target = lookTarget;
      });
    } else {
      this.tweenTranslate[index].onUpdate(() => {
        this.camera.position.set(origin.x, origin.y, origin.z);
      });
      this.tweenLook[index].onUpdate(() => {
        const lookTarget = new THREE.Vector3(originLook.x, originLook.y, originLook.z);
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

  updateWalkthroughViewIndex(state) {
    Object.assign(this.walkthroughState, state);
    this.walkthroughState.points = this.walkthroughState.walkthroughPoints.toJS();
    this.walkthroughState.viewIndex = state.viewIndex;

    if (this.walkthroughState.viewIndex !== -1) {
      const { pos } = this.walkthroughState.points[this.walkthroughState.viewIndex];
      const { lookAt } = this.walkthroughState.points[this.walkthroughState.viewIndex];

      this.camera.position.set(pos.x, pos.y, pos.z);
      const lookTarget = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);
      this.controls.constraint.target = lookTarget;
    }
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
    * Appends or remove the suffix for the resized texture
  */
  modifySuffix(texturePath, isAppend) {
    // Check suffix
    const endIndex = texturePath.lastIndexOf('.');
    const suffix = texturePath.substring(endIndex - 6, endIndex);
    let newPath = texturePath;
    // Replace texture if suffix match
    if (isAppend === false) {
      if (suffix === TEXTURE_SUFFIX) {
        newPath = texturePath.substring(0, endIndex - 6) + texturePath.substring(endIndex);
      }
    } else {
      if (suffix !== TEXTURE_SUFFIX) {
        newPath = texturePath.substring(0, endIndex) + TEXTURE_SUFFIX + texturePath.substring(endIndex);
      }
    }
    return newPath;
  }

  /**
    * Loads the original/resized images for texture and other maps
    * Precondition: Every texture image has a resized version named with the same suffix defined in TEXTURE_SUFFIX
  */
  loadTextures(isAppend) {
    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        if (child.material.name) {
          // loop through each type of mapped image
          for (let mapType = 0; mapType < 10; mapType++) {
            switch (mapType) {
              case 0: // texture map
                if (child.material.map && child.material.map.image) {
                  child.material.map.image.src = this.modifySuffix(
                    child.material.map.image.src,
                    isAppend
                  );
                }
                break;
              case 1: // bumpMap
                if (child.material.bumpMap) {
                  child.material.bumpMap.image.src = this.modifySuffix(
                    child.material.bumpMap.image.src,
                    isAppend
                  );
                }
                break;
              case 2: // normalMap
                if (child.material.normalMap) {
                  child.material.normalMap.image.src = this.modifySuffix(
                    child.material.normalMap.image.src,
                    isAppend
                  );
                }
                break;
              case 3: // lightMap
                if (child.material.lightMap) {
                  child.material.lightMap.image.src = this.modifySuffix(
                    child.material.lightMap.image.src,
                    isAppend
                  );
                }
                break;
              case 4: // ambient occlusion Map
                if (child.material.aoMap) {
                  child.material.aoMap.image.src = this.modifySuffix(
                    child.material.aoMap.image.src,
                    isAppend
                  );
                }
                break;
              case 5: // emissiveMap
                if (child.material.emissiveMap) {
                  child.material.emissiveMap.image.src = this.modifySuffix(
                    child.material.emissiveMap.image.src,
                    isAppend
                  );
                }
                break;
              case 6: // specularMap
                if (child.material.specularMap) {
                  child.material.specularMap.image.src = this.modifySuffix(
                    child.material.specularMap.image.src,
                    isAppend
                  );
                }
                break;
              case 7: // alphaMap
                if (child.material.alphaMap) {
                  child.material.alphaMap.image.src = this.modifySuffix(
                    child.material.alphaMap.image.src,
                    isAppend
                  );
                }
                break;
              case 8: // displacementMap
                if (child.material.displacementMap) {
                  child.material.displacementMap.image.src = this.modifySuffix(
                    child.material.displacementMap.image.src,
                    isAppend
                  );
                }
                break;
              case 9: // enviroment Map
                if (child.material.envMap) {
                  child.material.envMap.image.src = this.modifySuffix(
                    child.material.envMap.image.src,
                    isAppend
                  );
                }
                break;
              default:
            }
          }
        }
      }
    });
  }

  /**
   * Get the objects to display based on this.model and rendering state
   */
  _getDisplayObjects() {
    const objects = [];
    const { wireframe, shadingMode, resizedTexture } = this.renderingState;
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

    if (!resizedTexture) { // Texture to be at original resolution
      this.loadTextures(false);
    } else {
      this.loadTextures(true);
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
