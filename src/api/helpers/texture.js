import sharp from 'sharp';

export default {
  // Resize the image
  resize: (resizeFactor, imageSrcPath, imageDestPath) => {
    const image = sharp(imageSrcPath);
    return image
      .metadata()
      .then(metaData => {
        return image
          .resize(parseInt(metaData.width / resizeFactor, 10))
          .toFile(imageDestPath);
      });
  }
};
