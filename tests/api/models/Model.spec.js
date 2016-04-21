import { expect } from 'chai';
import sinon from 'sinon';

import Model from 'api/models/Model';
import { MongooseHelper } from 'api/helpers';
import { Constants } from 'common';

describe('Model Schema', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Validate Model', () => {
    it('Should pass if model object is valid', () => {
      const model = {
        _id: 'foo',
        title: 'bar'
      };

      const fields = {
        _id: true,
        title: true
      };

      expect(Model.validate(model, fields)).to.equal(null);
    });

    it('Should give error if model id is not valid', () => {
      const model1 = {
      };

      const model2 = {
        _id: ' '
      };

      const model3 = {
        _id: true
      };

      const fields = {
        _id: true
      };

      expect(Model.validate(model1, fields)).to.equal(Constants.ERROR_MODEL_ID_REQUIRED);
      expect(Model.validate(model2, fields)).to.equal(Constants.ERROR_MOEDL_ID_INVALID);
      expect(Model.validate(model3, fields)).to.equal(Constants.ERROR_MOEDL_ID_INVALID);
    });

    it('Should give error if model title is not valid', () => {
      const model1 = {
      };

      const model2 = {
        title: ' '
      };

      const model3 = {
        title: 'a'.repeat(201)
      };

      const fields = {
        title: true
      };

      expect(Model.validate(model1, fields)).to.equal(Constants.ERROR_MODEL_TITLE_REQUIRED);
      expect(Model.validate(model2, fields)).to.equal(Constants.ERROR_MODEL_TITLE_MIN_LENGTH);
      expect(Model.validate(model3, fields)).to.equal(Constants.ERROR_MODEL_TITLE_MAX_LENGTH);
    });
  });

  describe('Validate Model Filepaths', () => {
    it('Should pass if filepaths are valid', () => {
      const filePaths = ['foo.obj', 'test.mtl'];
      expect(Model.validateFilePaths(filePaths)).to.equal(null);
    });

    it('Should not pass if there is more than one obj or mtl file', () => {
      const filePaths1 = ['foo.obj', 'foo2.obj', 'test.mtl'];
      const filePaths2 = ['foo.obj', 'test.mtl', 'test2.mtl'];
      expect(Model.validateFilePaths(filePaths1)).to.equal(Constants.ERROR_MODEL_OBJ_FILE_NOT_UNIQUE);
      expect(Model.validateFilePaths(filePaths2)).to.equal(Constants.ERROR_MODEL_MTL_FILE_NOT_UNIQUE);
    });

    it('Should not pass if there is extra files without and mtl file', () => {
      const filePaths = ['foo.obj', 'bar.png'];
      expect(Model.validateFilePaths(filePaths)).to.equal(Constants.ERROR_MODEL_REDUNDANT_TEXTURES);
    });
  });

  describe('getModels', () => {
    it('Should call moongooseHelper with the given query and options', () => {
      const query = { foo: 'bar' };
      const options = { test: 'testtest' };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns('')
        .once()
        .withArgs(Model, query, options);

      Model.getModels(query, options);
      expect(moongooseHelperMock.verify()).to.be.true;
    });
  });

  describe('getLatestModels', () => {
    it('Should call moongooseHelper to obtain the latest models', () => {
      const options = {
        limit: 20,
        sort: '-updatedAt',
        populate: 'uploader'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns('')
        .once()
        .withArgs(Model, {}, options);

      Model.getLatestModels();
      expect(moongooseHelperMock.verify()).to.be.true;
    });
  });

  describe('getTopModels', () => {
    it('Should call moongooseHelper to obtain the top 9 models', () => {
      const options = {
        limit: 9,
        sort: '-socialData.views',
        populate: 'uploader'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns('')
        .once()
        .withArgs(Model, {}, options);

      Model.getTopModels();
      expect(moongooseHelperMock.verify()).to.be.true;
    });
  });

  describe('getBrowsePageModels', () => {
    it('Will not have a database query if there is no searchString', () => {
      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, {}, options);

      return Model.getBrowsePageModels({}).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Will return promise with empty array if all fields are excluded from search', () => {
      return Model.getBrowsePageModels(
        { searchTitle: '0', searchTag: '0', searchUser: '0', searchString: 'foo' })
      .then(results => expect(results).deep.equal([]));
    });

    it('Creates correct regex', () => {
      const input = {
        searchString: 'foo bar test',
        searchUser: '0',
        searchTag: '0'
      };

      const query = {
        title: new RegExp('(foo|bar|test)', 'i')
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Creates correct query when only title is searched', () => {
      const input = {
        searchString: 'foo',
        searchUser: '0',
        searchTag: '0'
      };

      const query = {
        title: new RegExp('(foo)', 'i')
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Creates correct query when only tag is searched', () => {
      const input = {
        searchString: 'foo',
        searchUser: '0',
        searchTitle: '0'
      };

      const query = {
        tags: new RegExp('(foo)', 'i')
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Creates correct query when only user is searched', () => {
      const input = {
        searchString: 'foo',
        searchTag: '0',
        searchTitle: '0',
        userIds: ['foo', 'bar']
      };

      const query = {
        uploader: { $in: input.userIds }
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Creates correct query when user and tags are searched', () => {
      const input = {
        searchString: 'foo',
        searchTitle: '0',
        userIds: ['foo', 'bar']
      };

      const query = {
        $or: [{ tags: new RegExp('(foo)', 'i') }, { uploader: { $in: input.userIds } }]
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Creates correct query when user and title are searched', () => {
      const input = {
        searchString: 'foo',
        searchTag: '0',
        userIds: ['foo', 'bar']
      };

      const query = {
        $or: [{ title: new RegExp('(foo)', 'i') }, { uploader: { $in: input.userIds } }]
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Creates correct query when title and tags are searched', () => {
      const input = {
        searchString: 'foo',
        searchUser: '0'
      };

      const query = {
        $or: [{ title: new RegExp('(foo)', 'i') }, { tags: new RegExp('(foo)', 'i') }]
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Creates correct query when all fields are searched', () => {
      const input = {
        searchString: 'foo',
        userIds: ['foo', 'bar']
      };

      const query = {
        $or: [{ title: new RegExp('(foo)', 'i') },
        { tags: new RegExp('(foo)', 'i') },
        { uploader: { $in: input.userIds } }]
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Use correct options when there is more than one page', () => {
      const input = {
        page: '2'
      };

      const options = {
        limit: 21,
        skip: 20,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, {}, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Include category in query when there is category in input', () => {
      const input = {
        category: 'Character'
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const query = {
        category: new RegExp('Character', 'i')
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, query, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Will not include category in query if category is not in app', () => {
      const input = {
        category: 'FooBar'
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-updatedAt'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, {}, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Will sort by views when sort input is 1', () => {
      const input = {
        sort: '1'
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: '-socialData.views'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, {}, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });

    it('Will sort by title when sort input is 2', () => {
      const input = {
        sort: '2'
      };

      const options = {
        limit: 21,
        populate: 'uploader',
        sort: 'title'
      };

      const moongooseHelperMock = sandbox.mock(MongooseHelper)
        .expects('find')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(Model, {}, options);

      return Model.getBrowsePageModels(input).then(() => {
        expect(moongooseHelperMock.verify()).to.be.true;
      });
    });
  });
});
