import { Authorisation } from 'api/middlewares';
import { UserController } from 'api/controllers';

export default (app) => {
  // Authentication
  app.get('/user/me', Authorisation.checkUser, UserController.request.me);
  app.get('/user/userInfo', Authorisation.requireUser, UserController.request.info);
  app.get('/user/adminInfo', Authorisation.requireAdmin, UserController.request.info);

  app.post('/user/register', UserController.request.register);
  app.post('/user/login', UserController.request.login);
  app.post('/user/adminLogin', UserController.request.adminLogin);
  app.post('/user/resetPassword', UserController.request.resetPassword);
  app.post('/user/logout', Authorisation.requireUser, UserController.request.logout);
};
