import Three from 'three';

class OrbitConstraint {
  // Focus target where camera orbits around
  target = new Three.Vector3()
  // Limits to how far you can dolly in and out ( PerspectiveCamera only )
  minDistance = 0
  maxDistance = Infinity
  // Limits to how far you can zoom in and out ( OrthographicCamera only )
  minZoom = 0
  maxZoom = Infinity
  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  minPolarAngle = 0
  maxPolarAngle = Math.PI
  // How far you can orbit horizontally, upper and lower limits.
  // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
  minAzimuthAngle = -Infinity
  maxAzimuthAngle = Infinity
  // Set to true to enable damping
  dampingFactor = 0.25

  // Epsilon
  _epsilon = 0.000001

  // Current position in spherical coordinate system.
  _theta = 0
  _phi = 0

  // Pending changes
  _phiDelta = 0
  _thetaDelta = 0
  _scale = 1
  _panOffset = new Three.Vector3()
  _zoomChanged = false

  // Last position and quaternion in the previous frame
  _lastPosition = new Three.Vector3();
  _lastQuaternion = new Three.Quaternion();

  constructor(camera) {
    if (!camera) {
      throw new Error('Camera is undefined');
    }
    this.camera = camera;
  }

  getPolarAngle() {
    return this._phi;
  }

  getAzimuthalAngle() {
    return this._theta;
  }

  rotateLeft(angle) {
    this._thetaDelta -= angle;
  }

  rotateUp(angle) {
    this._phiDelta -= angle;
  }

  _panLeft(distance) {
    const te = this.camera.matrix.elements;
    let v = new Three.Vector3(te[0], te[1], te[2]);
    v = v.multiplyScalar(-distance);
    this._panOffset.add(v);
  }

  _panUp(distance) {
    const te = this.camera.matrix.elements;
    let v = new Three.Vector3(te[4], te[5], te[6]);
    v = v.multiplyScalar(distance);
    this._panOffset.add(v);
  }

  pan(deltaX, deltaY, screenWidth, screenHeight) {
    if (this.camera instanceof Three.PerspectiveCamera) {
      // perspective
      const position = this.camera.position;
      let targetDistance = position.clone().sub(this.target).length();

      // half of the fov is center to top of screen
      targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180.0);

      // we actually don't use screenWidth, since perspective camera is fixed to screen height
      this._panLeft(2 * deltaX * targetDistance / screenHeight);
      this._panUp(2 * deltaY * targetDistance / screenHeight);
    } else {
      // orthographic
      this._panLeft(deltaX * (this.camera.right - this.camera.left) / screenWidth);
      this._panUp(deltaY * (this.camera.top - this.camera.bottom) / screenHeight);
    }
  }

  dollyIn(dollyScale) {
    if (this.camera instanceof Three.PerspectiveCamera) {
      this._scale /= dollyScale;
    } else {
      this.camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.camera.zoom * dollyScale));
      this.camera.updateProjectionMatrix();
      this._zoomChanged = true;
    }
  }

  dollyOut(dollyScale) {
    if (this.camera instanceof Three.PerspectiveCamera) {
      this._scale *= dollyScale;
    } else {
      this.camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.camera.zoom / dollyScale));
      this.camera.updateProjectionMatrix();
      this._zoomChanged = true;
    }
  }

  // Update function to be called for every frame
  update() {
    // Let camera.up is the orbit axis
    const quat = new Three.Quaternion().setFromUnitVectors(this.camera.up, new Three.Vector3(0, 1, 0));
    const quatInverse = quat.clone().inverse();
    // Rotate offset to "y-axis-is-up" space
    const offset = this.camera.position.clone().sub(this.target).applyQuaternion(quat);

    // angle from z-axis around y-axis
    this._theta = Math.atan2(offset.x, offset.z);

    // angle from y-axis
    this._phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

    this._theta += this._thetaDelta;
    this._phi += this._phiDelta;

    // restrict theta to be between desired limits
    this._theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this._theta));

    // restrict phi to be between desired limits
    this._phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._phi));

    // restrict phi to be betwee EPS and PI-EPS
    this._phi = Math.max(this._epsilon, Math.min(Math.PI - this._epsilon, this._phi));

    let radius = offset.length() * this._scale;

    // restrict radius to be between desired limits
    radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

    // move target to panned location
    this.target.add(this._panOffset);

    offset.x = radius * Math.sin(this._phi) * Math.sin(this._theta);
    offset.y = radius * Math.cos(this._phi);
    offset.z = radius * Math.sin(this._phi) * Math.cos(this._theta);

    // rotate offset back to "camera-up-vector-is-up" space
    offset.applyQuaternion(quatInverse);

    this.camera.position.copy(this.target).add(offset);

    this.camera.lookAt( this.target );

    this._thetaDelta *= (1 - this.dampingFactor);
    this._phiDelta *= (1 - this.dampingFactor);

    this._scale = 1;
    this._panOffset.set(0, 0, 0);

    // Update condition is:
    // min(camera displacement, camera rotation in radians)^2 > EPS
    // using small-angle approximation cos(x/2) = 1 - x^2 / 8
    if (this._zoomChanged
      || this._lastPosition.distanceToSquared(this.camera.position) > this._epsilon
      || 8 * (1 - this._lastQuaternion.dot(this.camera.quaternion)) > this._epsilon) {
      this._lastPosition.copy(this.camera.position);
      this._lastQuaternion.copy(this.camera.quaternion);
      this._zoomChanged = false;
      return true;
    }

    return false;
  }
}

export default OrbitConstraint;
