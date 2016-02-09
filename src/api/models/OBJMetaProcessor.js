export default {
  processFile(objFilePath) {
    const metadata = {
      vertex: 0,
      face: 0
    };

    const fs = require('fs');
    const lines = fs.readFileSync(objFilePath, 'utf8').toString().split('\n');
    for (let i = 0; i < lines.length; i++) {
      const splitLine = lines[i].split(' ');
      if (splitLine[0] === 'v') {
        metadata.vertex += 1;
      } else if (splitLine[0] === 'f') {
        metadata.face += 1;
      }
    }
    return metadata;
  }
};
