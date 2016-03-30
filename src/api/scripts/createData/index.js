import Promise from 'bluebird';

import { connectDb } from '../../config/database';
import { Model, User } from '../../models';
import { requireServerJson } from '../../../webapp/utils';

const usersList = requireServerJson(__dirname, './User.json');
const modelsList = requireServerJson(__dirname, './Model.json');

connectDb()
  // Clear Database
  .then(() => {
    return Promise.all([
      Promise.resolve(Model.remove({}).exec()),
      Promise.resolve(User.remove().exec())
    ]);
  })
  // Create User Data
  .then(() => {
    return Promise.all(
      usersList.map(u => User.createUser({
        name: u.name,
        email: u.email,
        password: u.password
      }))
    );
  })
  // Create Model Data
  .then((users) => {
    const nameIdMap = users.reduce((map, u) => {
      map[u.name] = u._id;
      return map;
    }, {});

    return Promise.all(
      modelsList.map(m => Model.createModel({
        title: m.title,
        uploader: nameIdMap[m.uploader],
        category: m.category,
        urls: m.urls,
        imageUrls: m.imageUrls,
        zipUrl: m.zipUrl,
        description: m.description,
        tags: m.tags,
        socialData: m.socialData,
        metaData: m.metaData
      }))
    );
  })
  .then(() => {
    process.exit();
  });
