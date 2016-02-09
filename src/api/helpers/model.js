import Promise from 'bluebird';
import fs from 'fs';
import readline from 'readline';

export default {
  processFile(objFilePath) {
    const metadata = {
      vertex: 0,
      face: 0
    };
    const rl = readline.createInterface({
      input: fs.createReadStream(objFilePath)
    });
    rl.on('line', line => {
      const splitLine = line.split(' ');
      if (splitLine[0] === 'v') {
        metadata.vertex += 1;
      } else if (splitLine[0] === 'f') {
        metadata.face += 1;
      }
    });

    return new Promise(resolve => {
      rl.on('close', () => {
        resolve(metadata);
      });
    });
  }
};
