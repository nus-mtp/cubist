import THREE from 'three';
import MTLLoader from './MTLLoader';

class OBJMTLLoader {
  constructor(manager) {
    this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
  }

  load(url, mtlurl, onLoad, onProgress, onError) {
    const mtlLoader = new MTLLoader(this.manager);
    mtlLoader.setBaseUrl(url.substr(0, url.lastIndexOf('/') + 1));
    mtlLoader.setCrossOrigin(this.crossOrigin);
    mtlLoader.load(mtlurl, materials => {
      const materialsCreator = materials;
      materialsCreator.preload();
      const loader = new THREE.XHRLoader(this.manager);
      loader.setCrossOrigin(this.crossOrigin);
      loader.load(url, (text) => {
        const object = this.parse(text);
        object.traverse(o => {
          if (o instanceof THREE.Mesh) {
            if (o.material.name) {
              const material = materialsCreator.create(o.material.name);
              if (material) {
                o.material = material;
              }
            }
          }
        });
        onLoad(object);
      }, onProgress, onError);
    }, onProgress, onError);
  }

  setCrossOrigin(value) {
    this.crossOrigin = value;
  }

  parse(data, mtllibCallback) {
    let faceOffset = 0;
    const group = new THREE.Group();
    let object = group;

    let geometry = new THREE.Geometry();
    let material = new THREE.MeshLambertMaterial();
    let mesh = new THREE.Mesh(geometry, material);

    let vertices = [];
    const normals = [];
    const uvs = [];

    function vector(x, y, z) {
      return new THREE.Vector3(x, y, z);
    }

    function uv(u, v) {
      return new THREE.Vector2(u, v);
    }

    function face3(a, b, c, n) {
      return new THREE.Face3(a, b, c, n);
    }

    function meshN(meshName, materialName) {
      if (vertices.length > 0) {
        geometry.vertices = vertices;
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeBoundingSphere();
        object.add(mesh);
        geometry = new THREE.Geometry();
        mesh = new THREE.Mesh(geometry, material);
      }

      if (meshName !== undefined) {
        mesh.name = meshName;
      }

      if (materialName !== undefined) {
        material = new THREE.MeshLambertMaterial();
        material.name = materialName;
        mesh.material = material;
      }
    }

    function addFace(a, b, c, normalsInds) {
      if (normalsInds === undefined) {
        geometry.faces.push(face3(
          parseInt(a, 10) - (faceOffset + 1),
          parseInt(b, 10) - (faceOffset + 1),
          parseInt(c, 10) - (faceOffset + 1)
       ));
      } else {
        geometry.faces.push(face3(
          parseInt(a, 10) - (faceOffset + 1),
          parseInt(b, 10) - (faceOffset + 1),
          parseInt(c, 10) - (faceOffset + 1),
          [
            normals[parseInt(normalsInds[0], 10) - 1].clone(),
            normals[parseInt(normalsInds[1], 10) - 1].clone(),
            normals[parseInt(normalsInds[2], 10) - 1].clone()
          ]
       ));
      }
    }

    function addUVs(a, b, c) {
      geometry.faceVertexUvs[0].push([
        uvs[parseInt(a, 10) - 1].clone(),
        uvs[parseInt(b, 10) - 1].clone(),
        uvs[parseInt(c, 10) - 1].clone()
      ]);
    }

    function handleFaceLine(faces, textureVectors, normalsInds) {
      if (faces[3] === undefined) {
        addFace(faces[0], faces[1], faces[2], normalsInds);
        if (!(textureVectors === undefined) && textureVectors.length > 0) {
          addUVs(textureVectors[0], textureVectors[1], textureVectors[2]);
        }
      } else {
        if (!(normalsInds === undefined) && normalsInds.length > 0) {
          addFace(faces[0], faces[1], faces[3], [normalsInds[0], normalsInds[1], normalsInds[3]]);
          addFace(faces[1], faces[2], faces[3], [normalsInds[1], normalsInds[2], normalsInds[3]]);
        } else {
          addFace(faces[0], faces[1], faces[3]);
          addFace(faces[1], faces[2], faces[3]);
        }
        if (! (textureVectors === undefined) && textureVectors.length > 0) {
          addUVs(textureVectors[0], textureVectors[1], textureVectors[3]);
          addUVs(textureVectors[1], textureVectors[2], textureVectors[3]);
        }
      }
    }

    // v float float float
    const vertexPattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

    // vn float float float
    const normalPattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

    // vt float float
    const uvPattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

    // f vertex vertex vertex ...
    const facePattern1 = /f( +\d+)( +\d+)( +\d+)( +\d+)?/;

    // f vertex/uv vertex/uv vertex/uv ...
    const facePattern2 = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/;

    // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
    const facePattern3 = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/;

    // f vertex//normal vertex//normal vertex//normal ...
    const facePattern4 = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/;

    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.trim();

      let result;
      if (line.length === 0 || line.charAt(0) === '#') {
        continue;
      } else if ((result = vertexPattern.exec(line)) !== null) {
        // ['v 1.0 2.0 3.0', '1.0', '2.0', '3.0']
        vertices.push(vector(
          parseFloat(result[1]),
          parseFloat(result[2]),
          parseFloat(result[3])
       ));
      } else if ((result = normalPattern.exec(line)) !== null) {
        // ['vn 1.0 2.0 3.0', '1.0', '2.0', '3.0']
        normals.push(vector(
          parseFloat(result[1]),
          parseFloat(result[2]),
          parseFloat(result[3])
       ));
      } else if ((result = uvPattern.exec(line)) !== null) {
        // ['vt 0.1 0.2', '0.1', '0.2']
        uvs.push(uv(
          parseFloat(result[1]),
          parseFloat(result[2])
       ));
      } else if ((result = facePattern1.exec(line)) !== null) {
        // ['f 1 2 3', '1', '2', '3', undefined]
        handleFaceLine([result[1], result[2], result[3], result[4]]);
      } else if ((result = facePattern2.exec(line)) !== null) {
        // ['f 1/1 2/2 3/3', ' 1/1', '1', '1', ' 2/2', '2', '2', ' 3/3', '3', '3', undefined, undefined, undefined]
        handleFaceLine(
          [result[2], result[5], result[8], result[11]], // faces
          [result[3], result[6], result[9], result[12]] // uv
        );
      } else if ((result = facePattern3.exec(line)) !== null) {
        // ['f 1/1/1 2/2/2 3/3/3', ' 1/1/1', '1', '1', '1', ' 2/2/2', '2', '2', '2', ' 3/3/3', '3', '3', '3', undefined, undefined, undefined, undefined]
        handleFaceLine(
          [result[2], result[6], result[10], result[14]], // faces
          [result[3], result[7], result[11], result[15]], // uv
          [result[4], result[8], result[12], result[16]] // normal
        );
      } else if ((result = facePattern4.exec(line)) !== null) {
        // ['f 1//1 2//2 3//3', ' 1//1', '1', '1', ' 2//2', '2', '2', ' 3//3', '3', '3', undefined, undefined, undefined]
        handleFaceLine(
          [result[2], result[5], result[8], result[11]], // faces
          [], // uv
          [result[3], result[6], result[9], result[12]] // normal
        );
      } else if (/^o /.test(line)) {
        // object
        meshN();
        faceOffset = faceOffset + vertices.length;
        vertices = [];
        object = new THREE.Object3D();
        object.name = line.substring(2).trim();
        group.add(object);
      } else if (/^g /.test(line)) {
        // group
        meshN(line.substring(2).trim(), undefined);
      } else if (/^usemtl /.test(line)) {
        // material
        meshN(undefined, line.substring(7).trim());
      } else if (/^mtllib /.test(line)) {
        // mtl file
        if (mtllibCallback) {
          let mtlfile = line.substring(7);
          mtlfile = mtlfile.trim();
          mtllibCallback(mtlfile);
        }
      } else if (/^s /.test(line)) {
        // Smooth shading

      } else {
        // Unhandled

      }
    }

    // Add last object
    meshN(undefined, undefined);

    return group;
  }
}

THREE.EventDispatcher.prototype.apply(OBJMTLLoader.prototype);

export default OBJMTLLoader;
