'use strict';

var fs = require('fs');
var path = require('path');
var filepath = path.resolve(__dirname, '../src/webapp/server/webpack-stats.json');

// Write only a relevant subset of the stats and attach the public path to it
var StatsHelper = {
  getChunks: function(name, ext, json, publicPath) {
    var chunk = json.assetsByChunkName[name];
    var extension = ext || 'js';

    // a chunk could be a string or an array, so make sure it is an array
    if (!(Array.isArray(chunk))) {
      chunk = [chunk];
    }

    return chunk
      .filter(function(chunkName) {
        return path.extname(chunkName) === '.' + extension;
      })
      .map(function(chunkName) {
        return publicPath + chunkName;
      });
  },

  writeStats: function(stats) {
    var publicPath = this.options.output.publicPath;
    var json = stats.toJson();

    // Fetch scripts
    var script = StatsHelper.getChunks('main', 'js', json, publicPath);
    // Fetch stylesheets
    var css = StatsHelper.getChunks('main', 'css', json, publicPath);
    // Fetch images
    var imagesRegex = /\.(jpe?g|png|gif|svg)$/;
    var images = json.modules
      .filter(function(module) {
        return imagesRegex.test(module.name);
      })
      .map(function(image) {
        var i = image.source.indexOf('"');
        var imageSource = image.source.slice(i + 1, -1);
        imageSource = imageSource.lastIndexOf('data:image', 0) === 0
          ? imageSource
          : publicPath + imageSource;
        return {
          original: image.name,
          compiled: imageSource
        };
      });

    var content = {
      script: script,
      css: css,
      images: images
    };

    fs.writeFileSync(filepath, JSON.stringify(content));
  },

  notifyStats: function(stats) {
    var json = stats.toJson();
    if (json.errors.length > 0) {
      json.errors.forEach(function(error) {
        console.log('\x07' + error);
      });
    } else if (json.warnings.length > 0) {
      json.warnings.forEach(function(warning) {
        console.log(warning);
      });
    } else {
      console.log(stats.toString({
        chunks: false,
        colors: true
      }));
    }
  }
};

module.exports = StatsHelper;
