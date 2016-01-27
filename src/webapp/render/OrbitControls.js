import OrbitConstraint from './OrbitConstraint';
import Three from 'three';

class OrbitControl extends Three.EventDispatcher {
  // Set to false to disable this control
  enabled = true;

  // Set to false to disable zooming
  enableZoom = true;
  zoomSpeed = 1.0;

  // Set to false to disable rotating
  enableRotate = true;
  rotateSpeed = 1.0;

  // Set to false to disable panning
  enablePan = true;
  keyPanSpeed = 7.0;

  // Set to true to automatically rotate around the target
  autoRotate = false;
  autoRotateSpeed = 2.0;

  // Set to true to Reset Camera to default viewpoint
  resetView = false;

  // Set to false to disable use of the keys
  enableKeys = true;

  // The four arrow keys
  keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

  // Mouse buttons
  mouseButtons = { ORBIT: Three.MOUSE.LEFT, ZOOM: Three.MOUSE.MIDDLE, PAN: Three.MOUSE.RIGHT };

  _rotateStart = new Three.Vector2();
  _rotateEnd = new Three.Vector2();
  _rotateDelta = new Three.Vector2();

  _panStart = new Three.Vector2();
  _panEnd = new Three.Vector2();
  _panDelta = new Three.Vector2();

  _dollyStart = new Three.Vector2();
  _dollyEnd = new Three.Vector2();
  _dollyDelta = new Three.Vector2();

  _STATE = {
    NONE: - 1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_DOLLY: 4,
    TOUCH_PAN: 5
  };

  _state = this._STATE.NONE;

  // Event Signal
  _changeEvent = { type: 'change' };
  _startEvent = { type: 'start' };
  _endEvent = { type: 'end' };

  constructor(camera, dimensions) {
    super();
    this.constraint = new OrbitConstraint(camera);
    this.dimensions = dimensions;
    this.update();

    // Attributes for reset
    this._target0 = this.target.clone();
    this._position0 = this.camera.position.clone();
    this._zoom0 = this.camera.zoom;
  }

  getPolarAngle() {
    return this.constraint.getPolarAngle();
  }

  getAzimuthalAngle() {
    return this.constraint.getAzimuthalAngle();
  }

  pan(deltaX, deltaY) {
    this.constraint.pan(deltaX, deltaY, this.dimensions.width, this.dimensions.height);
  }

  update() {
    if (this.resetView && this._state === this._STATE.NONE) {
      console.log('enter');
      this.reset();
    }

    if (this.autoRotate && this._state === this._STATE.NONE) {
      this.constraint.rotateLeft(this.getAutoRotationAngle());
    }

    if (this.constraint.update() === true) {
      this.dispatchEvent(this._changeEvent);
    }
  }

  reset() {
    this._state = this._STATE.NONE;
    this.resetView = false;

    this.target.copy(this._target0);
    this.camera.position.copy(this._position0);
    this.camera.zoom = this._zoom0;

    this.camera.updateProjectionMatrix();
    this.dispatchEvent(this._changeEvent);
    this.update();
  }

  getAutoRotationAngle() {
    return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
  }

  getZoomScale() {
    return Math.pow(0.95, this.zoomSpeed);
  }

  setDimensions(dimensions) {
    this.dimensions = dimensions;
  }

  onMouseDown = (event) => {
    if (this.enabled === false) {
      return;
    }

    event.preventDefault();

    if (event.button === this.mouseButtons.ORBIT) {
      if (this.enableRotate === false) {
        return;
      }
      this._state = this._STATE.ROTATE;
      this._rotateStart.set(event.clientX, event.clientY);
    } else if (event.button === this.mouseButtons.ZOOM) {
      if (this.enableZoom === false) {
        return;
      }
      this._state = this._STATE.DOLLY;
      this._dollyStart.set(event.clientX, event.clientY);
    } else if (event.button === this.mouseButtons.PAN) {
      if (this.enablePan === false) {
        return;
      }
      this._state = this._STATE.PAN;
      this._panStart.set(event.clientX, event.clientY);
    }

    if (this._state !== this._STATE.NONE) {
      this.dispatchEvent(this._startEvent);
    }
  };

  onMouseMove = (event) => {
    if (this.enabled === false) {
      return;
    }
    event.preventDefault();

    if (this._state === this._STATE.ROTATE) {
      if (this.enableRotate === false) {
        return;
      }

      this._rotateEnd.set(event.clientX, event.clientY);
      this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart);

      // rotating across whole screen goes 360 degrees around
      this.constraint.rotateLeft(2 * Math.PI * this._rotateDelta.x / this.dimensions.width * this.rotateSpeed);

      // rotating up and down along whole screen attempts to go 360, but limited to 180
      this.constraint.rotateUp(2 * Math.PI * this._rotateDelta.y / this.dimensions.height * this.rotateSpeed);

      this._rotateStart.copy(this._rotateEnd);
    } else if (this._state === this._STATE.DOLLY) {
      if (this.enableZoom === false) {
        return;
      }

      this._dollyEnd.set(event.clientX, event.clientY);
      this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart);

      if (this._dollyDelta.y > 0) {
        this.constraint.dollyIn(this.getZoomScale());
      } else if (this._dollyDelta.y < 0) {
        this.constraint.dollyOut(this.getZoomScale());
      }

      this._dollyStart.copy(this._dollyEnd);
    } else if (this._state === this._STATE.PAN) {
      if (this.enablePan === false) {
        return;
      }

      this._panEnd.set(event.clientX, event.clientY);
      this._panDelta.subVectors(this._panEnd, this._panStart);
      this.pan(this._panDelta.x, this._panDelta.y);

      this._panStart.copy(this._panEnd);
    }

    if (this._state !== this._STATE.NONE) {
      this.update();
    }
  };

  onMouseUp = () => {
    if (this.enabled === false) {
      return;
    }
    this.dispatchEvent(this._endEvent);
    this._state = this._STATE.NONE;
  };

  onMouseWheel = (event) => {
    if (this.enabled === false || this.enableZoom === false || this._state !== this._STATE.NONE) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const delta = event.deltaY;
    if (delta > 0) {
      this.constraint.dollyOut(this.getZoomScale());
    } else if (delta < 0) {
      this.constraint.dollyIn(this.getZoomScale());
    }

    this.update();
    this.dispatchEvent(this._startEvent);
    this.dispatchEvent(this._endEvent);
  };

  onKeyDown = (event) => {
    if (this.enabled === false || this.enableKeys === false || this.enablePan === false) {
      return;
    }

    switch (event.keyCode) {
      case this.keys.UP:
        this.pan(0, this.keyPanSpeed);
        this.update();
        break;

      case this.keys.BOTTOM:
        this.pan(0, -this.keyPanSpeed);
        this.update();
        break;

      case this.keys.LEFT:
        this.pan(this.keyPanSpeed, 0);
        this.update();
        break;

      case this.keys.RIGHT:
        this.pan(-this.keyPanSpeed, 0);
        this.update();
        break;

      default:
        return;
    }
  };

  onTouchStart = (event) => {
    if (this.enabled === false) {
      return;
    }

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate
        if (this.enableRotate === false) {
          return;
        }
        this._state = this._STATE.TOUCH_ROTATE;
        this._rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
        break;

      case 2: // two-fingered touch: dolly
        if (this.enableZoom === false) {
          return;
        }
        this._state = this._STATE.TOUCH_DOLLY;
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this._dollyStart.set(0, distance);
        break;

      case 3: // three-fingered touch: pan
        if (this.enablePan === false) {
          return;
        }
        this._state = this._STATE.TOUCH_PAN;
        this._panStart.set(event.touches[0].pageX, event.touches[0].pageY);
        break;

      default:
        this._state = this._STATE.NONE;
    }

    if (this._state !== this._STATE.NONE) {
      this.dispatchEvent(this._startEvent);
    }
  };

  onTouchMove = (event) => {
    if (this.enabled === false) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate
        if (this.enableRotate === false) {
          return;
        }
        if (this._state !== this._STATE.TOUCH_ROTATE) {
          return;
        }

        this._rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart);

        // rotating across whole screen goes 360 degrees around
        this.constraint.rotateLeft(2 * Math.PI * this._rotateDelta.x / this.dimensions.width * this.rotateSpeed);
        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.constraint.rotateUp(2 * Math.PI * this._rotateDelta.y / this.dimensions.height * this.rotateSpeed);

        this._rotateStart.copy(this._rotateEnd);

        this.update();
        break;

      case 2: // two-fingered touch: dolly
        if (this.enableZoom === false) {
          return;
        }
        if (this._state !== this._STATE.TOUCH_DOLLY) {
          return;
        }

        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this._dollyEnd.set(0, distance);
        this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart);

        if (this._dollyDelta.y > 0) {
          this.constraint.dollyOut(this.getZoomScale());
        } else if (this._dollyDelta.y < 0) {
          this.constraint.dollyIn(this.getZoomScale());
        }

        this._dollyStart.copy(this._dollyEnd);

        this.update();
        break;

      case 3: // three-fingered touch: pan

        if (this.enablePan === false) {
          return;
        }
        if (this._state !== this._STATE.TOUCH_PAN) {
          return;
        }

        this._panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        this._panDelta.subVectors(this._panEnd, this._panStart);

        this.pan(this._panDelta.x, this._panDelta.y);

        this._panStart.copy(this._panEnd);

        this.update();
        break;

      default:
        this._state = this._STATE.NONE;
    }
  };

  onTouchEnd = () => {
    if (this.enabled === false) {
      return;
    }

    this.dispatchEvent(this._endEvent);
    this._state = this._STATE.NONE;
  };

  dispose() {

  }

  // Virtual Properties
  get camera() {
    return this.constraint.camera;
  }

  get target() {
    return this.constraint.target;
  }

  set target(value) {
    this.constraint.target.copy(value);
  }

  get minDistance() {
    return this.constraint.minDistance;
  }

  set minDistance(value) {
    this.constraint.minDistance = value;
  }

  get maxDistance() {
    return this.constraint.maxDistance;
  }

  set maxDistance(value) {
    this.constraint.maxDistance = value;
  }

  get minZoom() {
    return this.constraint.minZoom;
  }

  set minZoom(value) {
    this.constraint.minZoom = value;
  }

  get maxZoom() {
    return this.constraint.maxZoom;
  }

  set maxZoom(value) {
    this.constraint.maxZoom = value;
  }

  get minPolarAngle() {
    return this.constraint.minPolarAngle;
  }

  set minPolarAngle(value) {
    this.constraint.minPolarAngle = value;
  }

  get maxPolarAngle() {
    return this.constraint.maxPolarAngle;
  }

  set maxPolarAngle(value) {
    this.constraint.maxPolarAngle = value;
  }

  get minAzimuthAngle() {
    return this.constraint.minAzimuthAngle;
  }

  set minAzimuthAngle(value) {
    this.constraint.minAzimuthAngle = value;
  }

  get maxAzimuthAngle() {
    return this.constraint.maxAzimuthAngle;
  }

  set maxAzimuthAngle(value) {
    this.constraint.maxAzimuthAngle = value;
  }

  get enableDamping() {
    return this.constraint.enableDamping;
  }

  set enableDamping(value) {
    this.constraint.enableDamping = value;
  }

  get dampingFactor() {
    return this.constraint.dampingFactor;
  }

  set dampingFactor(value) {
    this.constraint.dampingFactor = value;
  }
}

export default OrbitControl;
