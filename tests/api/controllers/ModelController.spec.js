import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import Promise from 'bluebird';

import ModelController from 'api/controllers/ModelController';
import Model from 'api/models/Model';
import User from 'api/models/User';

describe('Model Controller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('promise.getModel', () => {
    it('Should call Model.getModelById with the correct id', () => {
      const req = {
        params: {
          modelId: 'foo'
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('getModelById')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .withArgs('foo');

      return ModelController.promise.getModel(req).then(() => {
        expect(modelModelMock.verify()).to.be.true;
      });
    });
  });

  describe('promise.getModels', () => {
    it('Should call Model.getModels with the right query and options', () => {
      const req = {
        query: {
          query: {
            foo: 'bar'
          },
          options: {
            foo: 'bar'
          }
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('getModels')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .withArgs(req.query.query, req.query.options);

      return ModelController.promise.getModels(req).then(() => {
        expect(modelModelMock.verify()).to.be.true;
      });
    });
  });

  describe('promise.getTopModels', () => {
    it('Should call Model.getTopModels ', () => {
      const req = {
        foo: 'bar'
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('getTopModels')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once();

      return ModelController.promise.getTopModels(req).then(() => {
        expect(modelModelMock.verify()).to.be.true;
      });
    });
  });

  describe('promise.getLatestModels', () => {
    it('Should call Model.getLatestModels ', () => {
      const req = {
        foo: 'bar'
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('getLatestModels')
        .returns(
          new Promise(resolve => {
            resolve([]);
          })
        )
        .once();

      return ModelController.promise.getLatestModels(req).then(() => {
        expect(modelModelMock.verify()).to.be.true;
      });
    });
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
      + ' with correct arguments if request query has no searchString', () => {
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

  describe('promise.incrementViews', () => {
    it('Should validate modelid and reject invalid id', () => {
      const req = {
        params: {
          modelId: 'foo'
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs({ _id: 'foo' });

      return ModelController.promise.incrementViews(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call Model.incrementViews with the right id', () => {
      const req = {
        params: {
          modelId: 'foobar'
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('incrementViews')
        .returns('')
        .once()
        .withArgs('foobar');

      sandbox.stub(Model, 'validate').returns(null);

      ModelController.promise.incrementViews(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });

  describe('promise.toggleFlag', () => {
    it('Should validate modelid and and user, and reject invalid values', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        body: {
          isFlagged: false
        },
        user: {
          _id: 'bar'
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns(null)
        .once()
        .withArgs({ _id: 'foo' });

      const userModelMock = sandbox.mock(User)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs(req.user);


      return ModelController.promise.toggleFlag(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        expect(userModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call Model.flagModel with the correct params if isFlagged is true', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        body: {
          isFlagged: true
        },
        user: {
          _id: 'bar'
        }
      };

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('flagModel')
        .returns('')
        .once()
        .withArgs('foo', 'bar');

      ModelController.promise.toggleFlag(req);
      expect(modelModelMock.verify()).to.be.true;
    });

    it('Should call Model.unflagModel with the correct params if isFlagged is false', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        body: {
          isFlagged: false
        },
        user: {
          _id: 'bar'
        }
      };

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('unflagModel')
        .returns('')
        .once()
        .withArgs('foo', 'bar');

      ModelController.promise.toggleFlag(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });

  describe('promise.addSnapshots', () => {
    it('Should validate modelid and and user, and reject invalid values', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        files: [{
          fieldname: 'imageFiles',
          path: `${path.resolve(__dirname, '../../../storage/snapshots')}/text.png`
        }],
        user: {
          _id: 'bar'
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs({ _id: 'foo' });

      const userModelMock = sandbox.mock(User)
        .expects('validate')
        .returns(null)
        .once()
        .withArgs(req.user);


      return ModelController.promise.addSnapshots(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        expect(userModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call Model.addSnapshots with the correct params', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        files: [{
          fieldname: 'imageFiles',
          path: `${path.resolve(__dirname, '../../../storage/snapshots')}/text.png`
        }],
        user: {
          _id: 'bar'
        }
      };
      const edittedFiles = ['text.png'];

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('addSnapshots')
        .returns('')
        .once()
        .withArgs('foo', edittedFiles);

      ModelController.promise.addSnapshots(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });

  describe('promise.deleteSnapshot', () => {
    it('Should validate modelid and and user, and reject invalid values', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          index: 0
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs({ _id: 'foo' });

      const userModelMock = sandbox.mock(User)
        .expects('validate')
        .returns(null)
        .once()
        .withArgs(req.user);


      return ModelController.promise.deleteSnapshot(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        expect(userModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call Model.deleteSnapshot with the correct params', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          index: 0
        }
      };

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('deleteSnapshot')
        .returns('')
        .once()
        .withArgs('foo', 0);

      ModelController.promise.deleteSnapshot(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });

  describe('promise.addWalkthrough', () => {
    it('Should validate modelid and and user, and reject invalid values', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          points: []
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs({ _id: 'foo' });

      const userModelMock = sandbox.mock(User)
        .expects('validate')
        .returns(null)
        .once()
        .withArgs(req.user);


      return ModelController.promise.addWalkthrough(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        expect(userModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call Model.addWalkthrough with modelId and req.body', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          index: 0
        }
      };

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('addWalkthrough')
        .returns('')
        .once();

      ModelController.promise.addWalkthrough(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });

  describe('promise.updateWalkthrough', () => {
    it('Should validate modelid and and user, and reject invalid values', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          walkthrough: {
            animationMode: undefined
          }
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs({ _id: 'foo' });

      const userModelMock = sandbox.mock(User)
        .expects('validate')
        .returns(null)
        .once()
        .withArgs(req.user);


      return ModelController.promise.updateWalkthrough(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        expect(userModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call updateModelWalkthrough with exact given walkthrough point if point is not disjoint', () => {
      const update = {
        animationMode: 'test'
      };
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          index: 0,
          ...update
        }
      };

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('updateWalkthrough')
        .returns('')
        .once()
        .withArgs('foo', 0, ...update);

      ModelController.promise.updateWalkthrough(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });

  describe('promise.deleteWalkthrough', () => {
    it('Should validate modelid and and user, and reject invalid values', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          index: 0
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs({ _id: 'foo' });

      const userModelMock = sandbox.mock(User)
        .expects('validate')
        .returns(null)
        .once()
        .withArgs(req.user);


      return ModelController.promise.deleteWalkthrough(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        expect(userModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call Model.deleteWalkthrough with correct modelId and index', () => {
      const req = {
        params: {
          modelId: 'foo'
        },
        user: {
          _id: 'bar'
        },
        body: {
          index: 0
        }
      };

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('deleteWalkthrough')
        .returns('')
        .once()
        .withArgs('foo', 0);

      ModelController.promise.deleteWalkthrough(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });

  describe('promise.addStatisticsPoint', () => {
    it('Should validate modelid and reject invalid values', () => {
      const req = {
        params: {
          modelId: 'bar'
        },
        body: {
          point: {
            foo: 'bar'
          }
        }
      };

      const modelModelMock = sandbox.mock(Model)
        .expects('validate')
        .returns('test error')
        .once()
        .withArgs({ _id: 'bar' });

      return ModelController.promise.addStatisticsPoint(req).catch(() => {
        expect(modelModelMock.verify()).to.be.true;
        return 'rejected';
      }).then(result => {
        expect(result).to.equal('rejected');
      });
    });

    it('Should call Model.addStatisticsPoint with the modelId and point\'s data', () => {
      const req = {
        params: {
          modelId: 'bar'
        },
        body: {
          point: {
            foo: 'bar'
          }
        }
      };

      sandbox.stub(User, 'validate').returns(null);
      sandbox.stub(Model, 'validate').returns(null);

      const modelModelMock = sandbox.mock(Model)
        .expects('addStatisticsPoint')
        .returns('')
        .once()
        .withArgs('bar', req.body.point);

      ModelController.promise.addStatisticsPoint(req);
      expect(modelModelMock.verify()).to.be.true;
    });
  });
});
