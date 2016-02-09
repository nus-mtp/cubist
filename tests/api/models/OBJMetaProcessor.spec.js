import { expect } from 'chai';
import OBJMetaProcessor from 'api/models/OBJMetaProcessor';

describe('Process .obj file for vertex and face count', () => {
	it('Give the right count when supplied with file url', () => {
    	expect( OBJMetaProcessor.processFile('tests/test_files/test.obj')).deep.equal({ vertex: 15732, face: 5244});
  });
});