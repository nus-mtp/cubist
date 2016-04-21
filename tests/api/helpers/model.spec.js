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

  describe('Obtain base64 encoded data', () => {
    it('Return the correct data based on the directory and filenames', () => {
      return ModelHelper.obtainTextureFilesData('tests/test_files', ['test.obj', 'test.mtl'])
        .then(results => {
          expect(results).deep.equal({
            'test.obj': 'IyBCbGVuZGVyIHYyLjc2IChzdWIgMCkgT0JKIEZpbGU6ICcnCiMgd3d' +
              '3LmJsZW5kZXIub3JnCm10bGxpYiB0ZXN0Lm10bApvIEN1YmUKdiAxLjAwMDAwMCAt' +
              'MS4wMDAwMDAgLTEuMDAwMDAwCnYgMS4wMDAwMDAgLTEuMDAwMDAwIDEuMDAwMDAwC' +
              'nYgLTEuMDAwMDAwIC0xLjAwMDAwMCAxLjAwMDAwMAp2IC0xLjAwMDAwMCAtMS4wMD' +
              'AwMDAgLTEuMDAwMDAwCnYgMS4wMDAwMDAgMS4wMDAwMDAgLTAuOTk5OTk5CnYgMC4' +
              '5OTk5OTkgMS4wMDAwMDAgMS4wMDAwMDEKdiAtMS4wMDAwMDAgMS4wMDAwMDAgMS4w' +
              'MDAwMDAKdiAtMS4wMDAwMDAgMS4wMDAwMDAgLTEuMDAwMDAwCnZuIDAuMDAwMDAwI' +
              'C0xLjAwMDAwMCAwLjAwMDAwMAp2biAwLjAwMDAwMCAxLjAwMDAwMCAwLjAwMDAwMAp' +
              '2biAxLjAwMDAwMCAwLjAwMDAwMCAwLjAwMDAwMAp2biAtMC4wMDAwMDAgLTAuMDAw' +
              'MDAwIDEuMDAwMDAwCnZuIC0xLjAwMDAwMCAtMC4wMDAwMDAgLTAuMDAwMDAwCnZuI' +
              'DAuMDAwMDAwIDAuMDAwMDAwIC0xLjAwMDAwMAp1c2VtdGwgTWF0ZXJpYWwKcyBvZm' +
              'YKZiAxLy8xIDIvLzEgMy8vMSA0Ly8xCmYgNS8vMiA4Ly8yIDcvLzIgNi8vMgpmIDE' +
              'vLzMgNS8vMyA2Ly8zIDIvLzMKZiAyLy80IDYvLzQgNy8vNCAzLy80CmYgMy8vNSA3' +
              'Ly81IDgvLzUgNC8vNQpmIDUvLzYgMS8vNiA0Ly82IDgvLzYK',
            'test.mtl': 'IyBCbGVuZGVyIE1UTCBGaWxlOiAnTm9uZScKIyBNYXRlcmlhbCBDb3V' +
              'udDogNAoKbmV3bXRsIGJhc2UxCk5zIDk2LjA3ODQzMQpLYSAwLjAwMDAwMCAwLjAwMD' +
              'AwMCAwLjAwMDAwMApLZCAwLjU4ODIzNSAwLjU4ODIzNSAwLjU4ODIzNQpLcyAwLjExN' +
              'TAwMCAwLjExNTAwMCAwLjExNTAwMApOaSAxLjAwMDAwMApkIDEuMDAwMDAwCmlsbHVt' +
              'IDIKICBtYXBfS2EgICBlbXB0eTEuanBnCm1hcF9LZCAgZW1wdHkyLmpwZwptYXBfS3M' +
              'gc29tZXdoZXJlL2VtcHR5MC5qcGcKCm5ld210bCBmcmFtZTEKTnMgOTYuMDc4NDMxCk' +
              'thIDAuMDAwMDAwIDAuMDAwMDAwIDAuMDAwMDAwCktkIDAuNTg0MzE0IDAuNTg0MzE0I' +
              'DAuNTg0MzE0CktzIDAuMDU1MDAwIDAuMDU1MDAwIDAuMDU1MDAwCk5pIDEuMDAwMDAw' +
              'CmQgMS4wMDAwMDAKaWxsdW0gMgptYXBfS3MgZW1wdHkzLmpwZwptYXBfbnMgZW1wdHk' +
              '0LmpwZwoKbmV3bXRsIGxlZ3MxCk5zIDk2LjA3ODQzMQpLYSAwLjAwMDAwMCAwLjAwMD' +
              'AwMCAwLjAwMDAwMApLZCAwLjU4ODIzNSAwLjU4ODIzNSAwLjU4ODIzNQpLcyAwLjQ0O' +
              'TAyMCAwLjQ0OTAyMCAwLjQ0OTAyMApOaSAxLjAwMDAwMApkIDEuMDAwMDAwCmlsbHVt' +
              'IDIKbWFwX2QgZW1wdHk1LmpwZwptYXBfQnVtcCBlbXB0eTYuanBnCgpuZXdtdGwgc2V' +
              'hdDEKTnMgOTYuMDc4NDMxCkthIDAuMDAwMDAwIDAuMDAwMDAwIDAuMDAwMDAwCktkID' +
              'AuOTM3MjU1IDAuNjU4ODI0IDAuNjU4ODI0CktzIDAuMDgwMDAwIDAuMDgwMDAwIDAuM' +
              'DgwMDAwCk5pIDEuMDAwMDAwCmQgMS4wMDAwMDAKaWxsdW0gMgptYXBfS3MgZW1wdHk3' +
              'LmpwZwptYXBfbnMgZW1wdHk3LmpwZwpkaXNwIGVtcHR5Ny5qcGcKZGVjYWwgLW8gZW1' +
              'wdHk4LmpwZwpidW1wIGVtcHR5OS5qcGcK'
          });
        });
    });
  });
});
