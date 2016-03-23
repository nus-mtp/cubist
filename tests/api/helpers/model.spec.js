import { expect } from 'chai';
import sinon from 'sinon';

import ModelHelper from 'api/helpers/model';

describe('Model Helper', () => {
  describe('Process .obj file for vertex count, face count and boundingSphere radius', () => {
    it('Should give the right count when supplied with file url', () => {
      return ModelHelper.objVertexFaceCounter('tests/test_files/test.obj')
        .then(metaData => {
          expect(metaData).deep.equal({ vertices: 8, faces: 6, boundingRadius: 1.0000005 });
        });
    });
  });

  describe('Obtain texture files path from .mtl file', () => {
    it('Should give the correct array of file paths', () => {
      return ModelHelper.mtlTexturePaths('tests/test_files/test.mtl')
        .then(filenames => {
          expect(filenames.sort()).deep.equal(
            [
              'somewhere/empty0.jpg',
              'empty1.jpg',
              'empty2.jpg',
              'empty3.jpg',
              'empty4.jpg',
              'empty5.jpg',
              'empty6.jpg',
              'empty7.jpg',
              'empty8.jpg',
              'empty9.jpg'
            ].sort()
          );
        });
    });
  });

  describe('Check files listed in .mtl against files in an array', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should deliver true status with filenames in .mtl if all files are in array', () => {
      sandbox
        .stub(ModelHelper, 'mtlTexturePaths')
        .returns(
          new Promise(resolve => {
            const filenames = ['somewhere/empty.jpg'];
            resolve(filenames);
          })
        );
      return ModelHelper.mtlTexturesAvailable('foo.mtl', ['somewhere/empty.jpg'])
        .then(payload => {
          expect(payload).deep.equal({ hasRequiredTextures: true, hasRedundantTextures: false });
        });
    });

    it('Should deliver false status with filenames in .mtl if all files are not in array', () => {
      sandbox.stub(ModelHelper, 'mtlTexturePaths').returns(
        new Promise(resolve => {
          const filenames = ['somewhere/empty.jpg'];
          resolve(filenames);
        })
      );
      return ModelHelper.mtlTexturesAvailable('foo.mtl', ['empty.jpg'])
        .then(payload => {
          expect(payload).deep.equal({ hasRequiredTextures: false, hasRedundantTextures: true });
        });
    });
  });
});
