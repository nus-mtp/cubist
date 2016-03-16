import { expect } from 'chai';
import sinon from 'sinon';

import Model from 'api/models/Model';
import { MongooseHelper } from 'api/helpers';

describe('Model Schema', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
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
