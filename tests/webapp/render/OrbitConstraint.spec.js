import { expect } from 'chai';
import sinon from 'sinon';
import Three, {
  PerspectiveCamera,
  OrthographicCamera,
  Quaternion,
  Vector3
} from 'three';

import OrbitConstraint from 'webapp/render/OrbitConstraint';

describe('Orbit Constraint', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#constructor', () => {
    it('Should initialize the camera', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      expect(orbitConstraint.camera).is.instanceof(PerspectiveCamera);

      expect(orbitConstraint.target).is.instanceof(Vector3);

      expect(orbitConstraint.minDistance).is.equal(0);
      expect(orbitConstraint.maxDistance).is.equal(Infinity);

      expect(orbitConstraint.minZoom).is.equal(0);
      expect(orbitConstraint.maxZoom).is.equal(Infinity);

      expect(orbitConstraint.minPolarAngle).is.equal(0);
      expect(orbitConstraint.maxPolarAngle).is.equal(Math.PI);

      expect(orbitConstraint.minAzimuthAngle).is.equal(-Infinity);
      expect(orbitConstraint.maxAzimuthAngle).is.equal(Infinity);

      expect(orbitConstraint.dampingFactor).is.equal(0.25);

      expect(orbitConstraint._epsilon).is.equal(0.000001);

      expect(orbitConstraint._theta).is.equal(0);
      expect(orbitConstraint._phi).is.equal(0);

      expect(orbitConstraint._phiDelta).is.equal(0);
      expect(orbitConstraint._thetaDelta).is.equal(0);
      expect(orbitConstraint._scale).is.equal(1);
      expect(orbitConstraint._panOffset).is.instanceof(Vector3);
      expect(orbitConstraint._zoomChanged).is.false;

      expect(orbitConstraint._lastPosition).is.instanceof(Vector3);
      expect(orbitConstraint._lastQuaternion).is.instanceof(Quaternion);
    });

    it('Should throw error if there is no provided camera', () => {
      expect(() => new OrbitConstraint()).to.throw(Error);
    });
  });

  describe('#getPolarAngle', () => {
    it('Should return the current value of `_phi`', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      expect(orbitConstraint.getPolarAngle()).to.equal(orbitConstraint._phi);
      orbitConstraint._phi = 1.0;
      expect(orbitConstraint.getPolarAngle()).to.equal(orbitConstraint._phi);
    });
  });

  describe('#getAzimuthalAngle', () => {
    it('Should return the current value of `_theta`', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      expect(orbitConstraint.getAzimuthalAngle()).to.equal(orbitConstraint._theta);
      orbitConstraint._theta = 1.0;
      expect(orbitConstraint.getAzimuthalAngle()).to.equal(orbitConstraint._theta);
    });
  });

  describe('#rotateLeft', () => {
    it('Should decrement `_thetaDelta` by the amount of rotating angle', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      expect(orbitConstraint._thetaDelta).to.equal(0);
      orbitConstraint.rotateLeft(1.0);
      expect(orbitConstraint._thetaDelta).to.equal(-1);
    });
  });

  describe('#rotateUp', () => {
    it('Should decrement `_phiDelta` by the amount of rotating angle', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      expect(orbitConstraint._phiDelta).to.equal(0);
      orbitConstraint.rotateUp(1.0);
      expect(orbitConstraint._phiDelta).to.equal(-1);
    });
  });

  describe('#_panLeft', () => {
    it('Should decrement the pan offset by the distance multiplied with the camera transform in +x-axis', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      const vectorConstructorSpy = sandbox.spy(Three, 'Vector3');
      const multiplyScalarStub = sandbox
        .stub(Vector3.prototype, 'multiplyScalar')
        .returns({ x: 1, y: 1, z: 1 });
      const addSpy = sandbox.spy(Vector3.prototype, 'add');
      const distance = 2;
      sandbox.stub(orbitConstraint.camera.matrix, 'elements', [1, 1, 1]);
      orbitConstraint._panLeft(distance);

      expect(vectorConstructorSpy).is.calledWithNew;
      expect(vectorConstructorSpy).is.calledWith(1, 1, 1);
      expect(multiplyScalarStub).is.calledWith(-distance);
      expect(addSpy).is.calledWith({ x: 1, y: 1, z: 1 });
    });
  });

  describe('#_panUp', () => {
    it('Should increment the pan offset by the distance multiplied with the camera transform in +y-axis', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      const vectorConstructorSpy = sandbox.spy(Three, 'Vector3');
      const multiplyScalarStub = sandbox
        .stub(Vector3.prototype, 'multiplyScalar')
        .returns({ x: 1, y: 2, z: 3 });
      const addSpy = sandbox.spy(Vector3.prototype, 'add');
      const distance = 2;
      sandbox.stub(orbitConstraint.camera.matrix, 'elements', [0, 0, 0, 0, 3, 2, 1]);
      orbitConstraint._panUp(distance);

      expect(vectorConstructorSpy).is.calledWithNew;
      expect(vectorConstructorSpy).is.calledWith(3, 2, 1);
      expect(multiplyScalarStub).is.calledWith(distance);
      expect(addSpy).is.calledWith(multiplyScalarStub());
    });
  });

  describe('#pan', () => {
    it('Should handle when camera is perspective camera', () => {
      const deltaX = 1;
      const deltaY = 2;
      const screenHeight = 9;
      const offsetLength = 2;

      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      const subSpy = sandbox.spy(Vector3.prototype, 'sub');
      const spanLeftSpy = sandbox.spy(orbitConstraint, '_panLeft');
      const spanUpSpy = sandbox.spy(orbitConstraint, '_panUp');
      sandbox.stub(Vector3.prototype, 'length').returns(offsetLength);
      sandbox.stub(orbitConstraint, 'target', { x: 0, y: 0, z: 0 });
      sandbox.stub(orbitConstraint.camera, 'fov', 90);

      orbitConstraint.pan(deltaX, deltaY, 16, screenHeight);

      expect(subSpy).is.calledWith(orbitConstraint.target);
      expect(spanLeftSpy).is.calledWith(2 * deltaX * offsetLength / screenHeight);
      expect(spanUpSpy).is.calledWith(2 * deltaY * offsetLength / screenHeight);
    });

    it('Should handle when camera is orthographic camera', () => {
      const deltaX = 1;
      const deltaY = 2;
      const screenWidth = 16;
      const screenHeight = 9;

      const orbitConstraint = new OrbitConstraint(new OrthographicCamera());
      const spanLeftSpy = sandbox.spy(orbitConstraint, '_panLeft');
      const spanUpSpy = sandbox.spy(orbitConstraint, '_panUp');
      sandbox.stub(orbitConstraint.camera, 'top', 1);
      sandbox.stub(orbitConstraint.camera, 'bottom', -1);
      sandbox.stub(orbitConstraint.camera, 'left', -1);
      sandbox.stub(orbitConstraint.camera, 'right', 1);

      orbitConstraint.pan(deltaX, deltaY, screenWidth, screenHeight);

      expect(spanLeftSpy).is.calledWith(deltaX * 2 / screenWidth);
      expect(spanUpSpy).is.calledWith(deltaY * 2 / screenHeight);
    });
  });

  describe('#dollyIn', () => {
    it('Should handle when camera is perspective camera', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      orbitConstraint.dollyIn(2);
      expect(orbitConstraint._scale).is.equal(0.5);
    });

    it('Should handle when camera is orthographic camera', () => {
      const orbitConstraint = new OrbitConstraint(new OrthographicCamera());
      const updateProjectionSpy = sandbox.spy(orbitConstraint.camera, 'updateProjectionMatrix');
      sandbox.stub(orbitConstraint.camera, 'zoom', 1);

      orbitConstraint.dollyIn(2);

      expect(updateProjectionSpy).is.called;
      expect(orbitConstraint.camera.zoom).is.equal(2);
      expect(orbitConstraint._zoomChanged).is.true;
    });
  });

  describe('#dollyOut', () => {
    it('Should handle when camera is perspective camera', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      orbitConstraint.dollyOut(2);
      expect(orbitConstraint._scale).is.equal(2.0);
    });

    it('Should handle when camera is orthographic camera', () => {
      const orbitConstraint = new OrbitConstraint(new OrthographicCamera());
      const updateProjectionSpy = sandbox.spy(orbitConstraint.camera, 'updateProjectionMatrix');
      sandbox.stub(orbitConstraint.camera, 'zoom', 1);

      orbitConstraint.dollyOut(2);

      expect(updateProjectionSpy).is.called;
      expect(orbitConstraint.camera.zoom).is.equal(0.5);
      expect(orbitConstraint._zoomChanged).is.true;
    });
  });

  describe('#update', () => {
    it('Should update camera target', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      const targetSpy = sandbox.spy(orbitConstraint.target, 'add');
      const cameraSpy = sandbox.spy(orbitConstraint.camera, 'lookAt');
      orbitConstraint._panOffset = sinon.createStubInstance(Vector3);

      orbitConstraint.update();

      expect(targetSpy).is.calledWith(orbitConstraint._panOffset);
      expect(cameraSpy).is.calledWith(orbitConstraint.target);
      expect(cameraSpy).is.calledAfter(targetSpy);
      expect(orbitConstraint._panOffset.set).is.calledWith(0, 0, 0);
    });

    // TODO: Add tests for updating camera transforms

    it('Should update when zoom changed', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      orbitConstraint._zoomChanged = true;

      expect(orbitConstraint.update()).is.true;
      expect(orbitConstraint._zoomChanged).is.false;
    });

    it('Should update when square of camera displacement is larger than epsilon', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      const displacementStub = sandbox
        .stub(orbitConstraint._lastPosition, 'distanceToSquared')
        .returns(1);
      const copyStub = sandbox.spy(orbitConstraint._lastPosition, 'copy');

      expect(orbitConstraint.update()).is.true;
      expect(displacementStub).is.calledWith(orbitConstraint.camera.position);
      expect(copyStub).is.calledWith(orbitConstraint.camera.position);
    });

    it('Should update when square of camera rotation is larger than epsilon', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      const rotationStub = sandbox
        .stub(orbitConstraint._lastQuaternion, 'dot')
        .returns(0);
      const copyStub = sandbox.spy(orbitConstraint._lastQuaternion, 'copy');

      expect(orbitConstraint.update()).is.true;
      expect(rotationStub).is.calledWith(orbitConstraint.camera.quaternion);
      expect(copyStub).is.calledWith(orbitConstraint.camera.quaternion);
    });

    it('Should not update when the three above conditions are not satisfied', () => {
      const orbitConstraint = new OrbitConstraint(new PerspectiveCamera());
      orbitConstraint._zoomChanged = false;
      sandbox.stub(orbitConstraint._lastPosition, 'distanceToSquared').returns(0);
      sandbox.stub(orbitConstraint._lastQuaternion, 'dot').returns(1);
      expect(orbitConstraint.update()).is.false;
    });
  });
});
