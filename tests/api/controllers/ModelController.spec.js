import { expect } from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';

import ModelController from 'api/controllers/ModelController';
import { Model, User } from 'api/models';

describe('Model Controller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('promise.getBrowsePageModels', () => {
    it('Should call User.findByName(searchString) if request query has a searchString', () => {
      const req = {
        query: {
          searchString: 'foo'
        }
      };

      sandbox.stub(Model, 'getBrowsePageModels')
        .returns(
        new Promise(resolve => {
          resolve([]);
        })
      );

      const userModelMock = sandbox.mock(User)
        .expects('findByName')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs('foo');

      return ModelController.promise.getBrowsePageModels(req).then(() => {
        expect(userModelMock.verify()).to.be.true;
      });
    });

    it('Should call Model.getBrowsePageModels() with userIds if query has searchString', () => {
      const req = {
        query: {
          searchString: 'foo'
        }
      };

      const changedQuery = {
        searchString: 'foo',
        userIds: ['507f1f77bcf86cd799439011']
      };

      sandbox.stub(User, 'findByName').returns(
        new Promise(resolve => {
          resolve(['507f1f77bcf86cd799439011']);
        })
      );

      const modelModelMock = sandbox.mock(Model)
        .expects('getBrowsePageModels')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(changedQuery);

      return ModelController.promise.getBrowsePageModels(req).then(() => {
        expect(modelModelMock.verify()).to.be.true;
      });
    });

    it('Should not call User.findByName() and only call Model.getBrowsePageModels()'
      + 'with correct arguments if request query has no searchString', () => {
      const req = {
        query: {
          foo: 'bar'
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('getBrowsePageModels')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(req.query);

      const userModelMock = sandbox.mock(User)
        .expects('findByName')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .never();

      return ModelController.promise.getBrowsePageModels(req).then(() => {
        expect(userModelMock.verify()).to.be.true;
        expect(modelModelMock.verify()).to.be.true;
      });
    });

    it('Should not call User.findByName() if users are excluded from search', () => {
      const req = {
        query: {
          searchUser: '0',
          searchString: 'foobar'
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('getBrowsePageModels')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once()
        .withArgs(req.query);

      const userModelMock = sandbox.mock(User)
        .expects('findByName')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .never();

      return ModelController.promise.getBrowsePageModels(req).then(() => {
        expect(userModelMock.verify()).to.be.true;
        expect(modelModelMock.verify()).to.be.true;
      });
    });
  });
});
