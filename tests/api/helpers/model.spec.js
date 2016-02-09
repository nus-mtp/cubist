import { expect } from 'chai';
import { ModelHelper } from 'api/helpers';

describe('Process .obj file for vertex and face count', () => {
  it('Give the right count when supplied with file url', () => {
    return ModelHelper.processFile('tests/test_files/test.obj')
      .then(metaData => {
        expect(metaData).deep.equal({ vertex: 8, face: 6 });
      });
  });
});
